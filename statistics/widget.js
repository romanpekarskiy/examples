var StatisticsWidgetInputData = Backbone.Model.extend({
    defaults: {
        startDate: new Date(),
        endDate: new Date(),
        period: 'day',
        groups: []
    }
});

var StatisticsWidget = Backbone.View.extend({
    tagName: "div",
    className: "col-md-6 statistics-widget",
    initialize: function (options) {
        options = options || {};

        this.updateTimeout = undefined;
        this.pendingCount = 0;

        this.viewType = new (options.viewType || StatisticsScalarView)(_.extend({
            widget: this
        }, options.viewTypeOptions));
        this.inputData = new StatisticsWidgetInputData();
        this.value = options.value;

        this.templateData = options.templateData || {};
        if(options.template){
            this.template = _.template(options.template.html());
        }

        this.el.className = options.className || this.className;

        this.inputData.on('change', function () {
            this.update();
        }.bind(this));

        this.method = options.method;
        this.result = undefined;

    },
    render: function () {
        // clear
        this.$el.html('');

        this.viewType.update(this.result);

        if(this.template){
            this.$el.html(this.template(this.templateData));
            $(".viewElement", this.$el).append(this.viewType.$el);
        } else {
            this.$el.append(this.viewType.$el);
        }

        return this;
    },
    processingError: function (errorMessage) {
        this.$el.html('');

        if(this.template){
            this.$el.html(this.template(this.templateData));
        }

        this.$el.append($('<pre>ERROR!\n' + JSON.stringify(errorMessage,2,2) + '</pre>'));
    },
    update: function (force) {
        clearTimeout(this.updateTimeout);
        if(!force){
            this.updateTimeout = setTimeout(this.update.bind(this, true), 2000);
            return;
        }


        this.el.style.opacity = 0.2;
        this.viewType.processing();

        if(this.promiseChain){
            this.promiseChain.cancel();
        }
        return this.promiseChain = this.method(this.inputData)
            .then(function (results) {
                this.result = results;
                this.render();
                this.trigger('ready', results);
                this.el.style.opacity = 1;
                this.pendingCount = 0;
                return results;
            }.bind(this))
            .catch(function (error) {
                this.pendingCount++;
                if(this.pendingCount > 10){
                    this.processingError(error);
                    this.el.style.opacity = 1;
                } else {
                    setTimeout(this.update.bind(this), 6000);
                }
            }.bind(this))
    }
});