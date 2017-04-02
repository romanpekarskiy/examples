var StatisticsWidgetsContainer = Backbone.View.extend({
    tagName: "div",
    initialize: function (options) {
        options = options || {};

        this.config = options;
        this.childWidgets = [];
        this.parseConfig();
        this.render();
    },
    parseConfig: function () {
        _.each(this.config.widgets, function (widgetConfig){
            this.childWidgets.push(this.createWidget(widgetConfig));
        }.bind(this));
    },
    createWidget: function (widgetConfig) {
        return new StatisticsWidget(widgetConfig);
    },
    render: function () {
        _.each(this.childWidgets, function (widget){
            this.$el.append(widget.$el);
            widget.render();
        }.bind(this));
    },
    update: function () {

    }
});