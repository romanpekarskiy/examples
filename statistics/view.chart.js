var StatisticsChartView = Backbone.View.extend({
    tagName: "div",
    buildTimeLine: function () {
        function buildTimeLineMonths() {
            var lastMonth = null;
            this.chart.data.labels = this.data.map(function (item, index) {
                var date = new Date(item.time);

                var monthString = date.toUTCString().substr(8, 3);

                return [monthString];
            });
        }

        function buildTimeLineDays() {
            var lastMonth = null;
            this.chart.data.labels = this.data.map(function (item, index) {
                var date = new Date(item.time);

                var dayString = date.toUTCString().substr(5,2);
                var monthString = date.toUTCString().substr(8,3);

                var showedDayString = dayString;
                var showedMonthString = '';

                if(date.getDate() == 1) showedMonthString = monthString;
                if(monthString != lastMonth) showedMonthString = monthString;

                lastMonth = monthString;

                return [showedMonthString, showedDayString];
            });
        }

        function buildTimeLineHours() {
            var lastMonth = null;
            var lastDay = null;
            this.chart.data.labels = this.data.map(function (item, index) {
                var date = new Date(item.time);

                var hourString = date.toUTCString().substr(17,5);
                var dayString = date.toUTCString().substr(5,2);
                var monthString = date.toUTCString().substr(8,2);

                var showedHourString = hourString;
                var showedDayString = '';
                var showedMonthString = '';


                if(date.getDate() == 1 && hourString == '00:00') showedMonthString = monthString;
                if(monthString != lastMonth) showedMonthString = monthString;
                if(dayString != lastDay) showedDayString = dayString;

                lastMonth = monthString;
                lastDay = dayString;

                return [showedMonthString, showedDayString, showedHourString];
            });
        }

        switch (this.widget.inputData.get('period')){
            case 'month': return buildTimeLineMonths.call(this); break;
            case 'day': return buildTimeLineDays.call(this); break;
            case 'hour': return buildTimeLineHours.call(this); break;
            default: return buildTimeLineDays.call(this); break;
        }
    },
    hoverTickTitleCallback: function (item) {
        var dataItem = this.data[item[0].index];

        switch (this.widget.inputData.get('period')){
            case 'day':
                return (new Date(dataItem.time)).toUTCString().substr(5,11);
                break;
            case 'hour':
                return (new Date(dataItem.time)).toUTCString().substr(5,17);
                break;
            default:
                return (new Date(dataItem.time)).toUTCString().substr(5,11);
                break;
        }
    },
    hoverTickLabelCallback: function (item) {
        if(this.options.useParseInt === false){
            return item.yLabel;
        }
        return parseInt(item.yLabel);
    },
    initialize: function (options) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 400;
        this.canvas.height = 120;
        this.ctx = this.canvas.getContext("2d");
        this.$el.append(this.canvas);
        this.options = options;
        this.widget = options.widget;

        this.chart = new Chart(this.ctx, {
            type: 'line',
            data: {
                datasets: [{
                    lineTension: 0,
                    borderColor: 'rgba(53, 126, 189, 0.82)',
                    backgroundColor: 'rgba(66, 139, 202, 0.31)',
                    borderWidth: 1,
                    pointRadius: 0
                }]
            },
            options: {
                animation: {
                    duration: 300
                },
                legend:{
                    display: false
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    callbacks:{
                        title: this.hoverTickTitleCallback.bind(this),
                        label: this.hoverTickLabelCallback.bind(this)
                    }
                },
                showXLabels: 10,
                scales: {
                    gridLines: [{
                        display: false
                    }],
                    xAxes: [{
                        position: 'bottom',
                        autoSkip: false,
                        gridLines: {
                            color: "rgba(0, 0, 0, 0.02)"
                        },
                        ticks: {
                            fontSize: 10,
                            maxRotation: 0,
                            autoSkipPadding: 5
                        }


                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });

    },
    render: function () {
        this.$el.append(this.canvas);

        return this;
    },
    processing: function () {
        // this.canvas.style.opacity = 0.3;
        return this;
    },
    update: function (data) {
        // console.log('data',data);

        this.data = data || [];
        // this.data = _.map(data, function (item) {
        //     return {x:new Date(item.time), y:item.count}
        // });

        // console.log(this.data);

        this.buildTimeLine();

        this.chart.data.datasets[0].data = this.data.map(function(item){
            return item.count
        });

        this.canvas.style.opacity = 1;

        this.chart.update();

        return this.render();
    }
});