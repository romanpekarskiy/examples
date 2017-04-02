var DeviceEventModel = Backbone.Model.extend({});

function toMoscowTime(time) {
    var date = new Date(time);
    date.setUTCHours(date.getUTCHours() + 3);
    return date;
}

function getMoscowTimeString(time) {
    var date = toMoscowTime(time);
    return date.toUTCString().slice(17, 22)
}

function getMoskowDateString(time) {
    var date = toMoscowTime(time);
    return date.toUTCString().slice(5, 16);
}

var DeviceEventView = Backbone.View.extend({
    tagName: "div",
    className: "device-event",
    template: (function () {
        var htmlTemplates = $("[id*='eventDataTemplate']");
        var templates = {};
        _.each(htmlTemplates, function (template) {
            var type = template.id.replace('eventDataTemplate-', '');
            templates[type] = _.template($(template).html());
        });

        templates.base = _.template($("#eventTemplate").html());
        return templates;
    })(),

    initialize: function (options) {
        this.jsonState = false;
        this.isRight = options.right || false;
        this.listenTo(this.model, 'change', this.render);
        this.$el.dblclick(this.switchState.bind(this));
    },

    switchState: function () {
        if (!this.jsonState) {
            this.jsonState = true;
            this.renderJSON();
        } else {
            this.jsonState = false;
            this.render();
        }
    },

    renderJSON: function () {
        var type = this.model.get('type');

        this.$el.html(this.template.base({
            type: this.model.get('type'),
            right: this.isRight,
            time: getMoscowTimeString(this.model.get('time'))
        }));

        $('.event-data', this.$el).html(this.template.json({
            data: this.model.attributes
        }));

        this.$el.addClass(type);

        return this;
    },

    render: function () {
        var type = this.model.get('type');

        this.$el.html(this.template.base({
            type: this.model.get('type'),
            right: this.isRight,
            time: getMoscowTimeString(this.model.get('time'))
        }));

        var dataTemplate = this.template[type] || this.template.default;

        $('.event-data', this.$el).html(dataTemplate({
            data: this.model.attributes
        }));

        this.$el.addClass(type);

        return this;
    }
});

var DeviceEvents = Backbone.Collection.extend({
    model: DeviceEventModel,

    load: function (options) {
        var data = {
            parameters: {
                uid: this.deviceId,
                startDate: options.startDate,
                endDate: options.endDate,
                ttl: 60 * 60
            }
        };

        data.options = {
            from: options.from,
            to: options.to
        };

        return $.ajax({
            url: 'https://zoomtv-statistics-new.westeurope.cloudapp.azure.com/processor/v1/api/lastEvents',
            type: 'POST',
            json: true,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data)
        })
            .then(function (result) {
                if (result.data) {
                    var events = result.data;
                    _.each(events, function (event) {
                        this.add(event);
                    }.bind(this));
                }
                return result;
            }.bind(this))
    }
});

var newDateTemplate = _.template($("#newDayTemplate").html());

var DeviceEventsView = Backbone.View.extend({
    tagName: "div",
    className: "device-events-container",

    initialize: function (options) {
        this.lastDeviceEvent = null;
        $(document).scroll(function () {
            if (!this.canMore) return;

            var scrollPos = window.pageYOffset || document.documentElement.scrollTop;
            var screenHeight = window.innerHeight;

            var elementPosition = this.$el.offset().top + this.$el.innerHeight() - screenHeight;

            if (elementPosition < scrollPos) {
                this.more();
            }
        }.bind(this));
        this.deviceId = options.deviceId;
        this.afterLoadChannels = this.loadChannels();
        this.deviceEvents = new DeviceEvents();
        this.deviceEvents.deviceId = options.deviceId;
        this.listenTo(this.deviceEvents, 'add', this.addOne.bind(this));
        this.listenTo(this.deviceEvents, 'reset', this.addAll.bind(this));
    },

    loadChannels: function () {
        return $.ajax({
            url: '/channel/list?id=' + encodeURIComponent(this.deviceId)
        })
            .then(function (response) {
                this.channels = response.data;
                console.log('channels loaded', this.channels);
                return this.channels;
            }.bind(this))
    },

    setDate: function (options) {
        this.startPos = 0;
        this.startDate = options.startDate;
        this.endDate = options.endDate;
    },

    load: function () {
        if (this.loading) return;

        var requested = 100;
        this.loading = true;
        this.deviceEvents.load({
            startDate: this.startDate,
            endDate: this.endDate,
            from: this.startPos
        })
            .then(function (result) {
                this.loading = false;
                if (result.length > requested + this.startPos) {
                    this.canMore = true;
                } else {
                    this.canMore = false;
                }
                if (this.filtering) {
                    this.filter(this.filtering);
                }
            }.bind(this));
    },

    more: function () {
        if (this.loading) return;
        this.startPos += 100;
        this.load();
    },

    addOne: function (deviceEvent) {
        var moskowUTCDate = new Date(deviceEvent.get('time'));
        moskowUTCDate.setUTCHours(moskowUTCDate.getUTCHours() + 3);
        var isRight = false;

        if (!this.lastDeviceEvent) {
            this.$el.append($(
                newDateTemplate({date: moskowUTCDate})
            ));
        } else {
            var lastEventDate = getMoskowDateString(this.lastDeviceEvent.model.get('time'));
            var thisEventDate = getMoskowDateString(deviceEvent.get('time'));
            if (lastEventDate != thisEventDate) {
                this.$el.append($(
                    newDateTemplate({date: moskowUTCDate})
                ));
            } else {
                isRight = !this.lastDeviceEvent.isRight;
            }
        }
        var deviceEventView = new DeviceEventView({
            model: deviceEvent,
            right: isRight
        });

        this.lastDeviceEvent = deviceEventView;
        this.$el.append(deviceEventView.render().$el);

        this.afterLoadChannels
            .then(function (channels) {
                var channel_id = (deviceEvent.get('attributes') || {}).channel_id;

                if (channel_id) {
                    var channel = _.find(channels, function (channel) {
                        return channel.id == channel_id;
                    });

                    if (channel) {
                        deviceEvent.set('channel_name', channel.name);
                    }
                }
            });
    },

    reset: function () {
        this.deviceEvents.reset();
    },

    addAll: function () {
        this.$el.html('');
        this.deviceEvents.each(this.addOne, this);
    },
    
    filter: function (types) {
        this.$el.html('');
        this.lastDeviceEvent = null;
        var filtered;

        if (types.length) {
            this.filtering = types;
            filtered = this.deviceEvents.filter(function (event) {
                return _.contains(types, event.get('type'));
            });
        } else {
            this.filtering = false;
            filtered = this.deviceEvents.models;
        }

        _.each(filtered, this.addOne.bind(this));
    }
});
