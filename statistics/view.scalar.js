var StatisticsScalarView = Backbone.View.extend({
    tagName: "span",
    initialize: function (options) {
        this.widget = options.widget;
    },
    render: function () {
        if(this.data != undefined && this.data != null){
            this.$el.html(this.data);
        } else {
            this.$el.html('no data');
        }
        return this;
    },
    processing: function () {
        this.$el.html('Processing..');
        return this;
    },
    update: function (data) {
        this.data = data;
        return this.render();
    }
});