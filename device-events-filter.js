var DeviceEventFilterModel = Backbone.Model.extend({
    names: {
        "APP_START": "Запуски приложения",
        "BROADCAST_WATCH": "Просмотры передач",
        "BROADCAST_START": "Запуски передач",
        "PAYMENT_SUCCESS": "Оплаты"
    },
    defaults: {
        enabled: false,
        type: 'unknown_type'
    },
    initialize: function () {
        this.set('name', this.names[this.get('type')] || this.get('type'))
    }
});

var DeviceEventFilters = Backbone.Collection.extend({
    model: DeviceEventFilterModel,

    initialize: function () {
        this.registeredTypes = {};
        this.on('add', function (eventFilter) {
            this.registeredTypes[eventFilter.get('type')] = true;
        }.bind(this));
    },

    tryToAddType: function (deviceEvent) {
        var type = deviceEvent.get('type');
        if(!this.registeredTypes[type]){
            this.add({
                type: type
            });
        }
    },

    getFilter: function () {
        var hasDisabled = this.find(function(el){
            return el.get('enabled') == false
        });

        if(!hasDisabled){
            return []
        }

        var filters = this.filter(function(el){
            return el.get('enabled') == true
        });

        return _.map(filters, function (filter) {
            return filter.get('type');
        })
    }
});

var DeviceEventFilterView = Backbone.View.extend({
    tagName: "div",
    className: "event-filter label btn btn-info",

    initialize: function (options) {
        this.listenTo(this.model, 'change', this.render);
        this.$el.click(function () {
            this.model.set('enabled', this.model.get('enabled')? false: true);
        }.bind(this));
    },

    render: function () {
        this.$el.html(this.model.get('name'));

        if(this.model.get('enabled')){
            this.el.className = "event-filter label btn btn-info label-info";
        } else {
            this.el.className = "event-filter label btn btn-default label-default";
        }

        return this;
    }
});

var DeviceEventFiltersView = Backbone.View.extend({
    tagName: "div",
    className: "device-events_filter",

    initialize: function (options) {
        this.deviceEventFilters = new DeviceEventFilters();
        this.listenTo(this.deviceEventFilters, 'add', this.addOne.bind(this));
        this.listenTo(this.deviceEventFilters, 'reset', this.addAll.bind(this));
    },

    addOne: function(deviceEventFilter){
        var deviceEventFilterView = new DeviceEventFilterView({
            model: deviceEventFilter
        });

        deviceEventFilterView.$el.click(function () {
            this.trigger('filter',this.deviceEventFilters.getFilter())
        }.bind(this));

        this.$el.append(deviceEventFilterView.render().$el);
    },
    
    addAll: function(){
        this.deviceEventFilters.each(this.addOne, this);
    }
});
