var statisticsMethods = {};
var ttl = 60*30;

function processorRequest (method, data) {
    data.options = {
        from: 0,
        to: -1
    };

    return new Promise(function (resolve, reject, onCancel) {
        var request = $.ajax({
            url: processorUrl+'/api/'+method,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            json: true,
            success: function(result){
                if(result.status == 'PENDING'){
                    // console.log('PENDING');
                    //return resolve('все еще думает, обнови');
                    return reject({msg:'все еще думает, обнови'});
                }
                resolve(result.data);
            },
            failure: function(errMsg) {
                reject(errMsg);
            }
        });

        onCancel(function() {
            request.abort();
        });
    })
}

statisticsMethods.getFirstLaunches = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var groups = parameters.get('groups');

    if(groups.length == 0) groups = undefined;

    var request = {
        parameters: {
            type: "APP_START",
            attributes: {
                first: true
            },
            period: "overall",
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            groups: groups,
            ttl: ttl
        }
    };

    return processorRequest('events',request)
        .then(function (data) {
            return data[0].count;
        });
};


statisticsMethods.getUniquesLaunches = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var groups = parameters.get('groups');

    var request = {
        parameters:{
            type: 'APP_START',
            period: 'overall',
            uniques: true,
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            groups: groups,
            ttl: ttl
        }
    };

    return processorRequest('events',request)
        .then(function (data) {
            return data[0].count;
        });
};


statisticsMethods.getSpecialOfferViewers = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var groups = parameters.get('groups');

    var request = {
        parameters:{
            type: 'PERSONAL_OFFER_WATCH',
            uniques: true,
            period: 'overall',
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            groups: groups,
            ttl: ttl
        }
    };

    return processorRequest('events',request)
        .then(function (data) {
            return data[0].count;
        });
};


statisticsMethods.getPaymentViewers = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var groups = parameters.get('groups');

    var request = {
        parameters:{
            type: 'PAYMENT_POPUP',
            uniques: true,
            period: 'overall',
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            groups: groups,
            ttl: ttl
        }
    };

    return processorRequest('events',request)
        .then(function (data) {
            return data[0].count;
        });
};

statisticsMethods.getPaymentFailure = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var groups = parameters.get('groups');

    var request = {
        parameters:{
            type: 'PAYMENT_FAILURE',
            uniques: true,
            period: 'overall',
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            groups: groups,
            ttl: ttl
        }
    };

    return processorRequest('events',request)
        .then(function (data) {
            return data[0].count;
        });
};

statisticsMethods.getFirstPaymentsUniques = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var groups = parameters.get('groups');

    var request = {
        parameters:{
            type: 'PAYMENT_SUCCESS',
            attributes:{
                first: true
            },
            uniques: true,
            period: 'overall',
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            groups: groups,
            ttl: ttl
        }
    };

    return processorRequest('events',request)
        .then(function (data) {
            return data[0].count;
        });
};

statisticsMethods.getPaymentsUniques = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var groups = parameters.get('groups');

    var request = {
        parameters:{
            type: 'PAYMENT_SUCCESS',
            uniques: true,
            period: 'overall',
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            groups: groups,
            ttl: ttl
        }
    };

    return processorRequest('events',request)
        .then(function (data) {
            return data[0].count;
        });
};


statisticsMethods.getFirstPaymentsAmount = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var groups = parameters.get('groups');

    var request = {
        parameters:{
            type: 'PAYMENT_SUCCESS',
            attribute: 'amount',
            attributes:{
                first: true
            },
            period: 'overall',
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            groups: groups,
            ttl: ttl
        }
    };

    return processorRequest('summAttributeEvents',request)
        .then(function (data) {
            return data[0].count;
        });
};


statisticsMethods.getPaymentsAmount = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var groups = parameters.get('groups');

    var request = {
        parameters:{
            type: 'PAYMENT_SUCCESS',
            attribute: 'amount',
            period: 'overall',
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            groups: groups,
            ttl: ttl
        }
    };

    return processorRequest('summAttributeEvents',request)
        .then(function (data) {
            return data[0].count;
        });
};


statisticsMethods.getWatchedMoreThan2Hours = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var groups = parameters.get('groups');

    var request = {
        'parameters':{
            type: 'BROADCAST_WATCH',
            attribute: 'duration',
            output: 'uniques_count',
            condition:{
                gt:60*2
            },
            period: 'overall',
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            groups: groups,
            ttl: ttl
        }
    };

    return processorRequest('summAttributeEvents',request)
        .then(function (data) {
            return data[0].count;
        });
};


statisticsMethods.getLaunchesOnPeriod = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var groups = parameters.get('groups');
    var period = parameters.get('period');

    var request = {
        parameters: {
            type: "APP_START",
            period: period,
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            groups: groups,
            ttl: ttl
        }
    };

    return processorRequest('events',request)
        .then(function (data) {
            return data;
        });
};

statisticsMethods.getFirstLaunchesOnPeriod = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var groups = parameters.get('groups');
    var period = parameters.get('period');

    var request = {
        parameters: {
            type: "APP_START",
            attributes: {
                first: true
            },
            period: period,
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            groups: groups,
            ttl: ttl
        }
    };

    return processorRequest('events',request)
        .then(function (data) {
            return data;
        });
};

statisticsMethods.getPaymentsAmountOnPeriod = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var groups = parameters.get('groups');
    var period = parameters.get('period');

    var request = {
        parameters:{
            type: 'PAYMENT_SUCCESS',
            attribute: 'amount',
            period: period,
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            groups: groups,
            ttl: ttl
        }
    };

    return processorRequest('summAttributeEvents',request)
        .then(function (data) {
            return data;
        });
};

statisticsMethods.getPaymentsOnPeriod = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var groups = parameters.get('groups');
    var period = parameters.get('period');

    var request = {
        parameters:{
            type: 'PAYMENT_SUCCESS',
            period: period,
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            groups: groups,
            ttl: ttl
        }
    };

    return processorRequest('events',request)
        .then(function (data) {
            return data;
        });
};

statisticsMethods.getWatchedHoursOnPeriod = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var groups = parameters.get('groups');
    var period = parameters.get('period');

    var request = {
        parameters:{
            type: 'BROADCAST_WATCH',
            attribute: 'duration',
            period: period,
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            groups: groups,
            ttl: ttl
        }
    };

    return processorRequest('summAttributeEvents',request)
        .then(function (data) {

            // return data;
            return data.map(function (item) {
                item.count = item.count / 3600;
                return item;
            });
        });
};


statisticsMethods.getFirstPaymentsOnPeriod = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var groups = parameters.get('groups');
    var period = parameters.get('period');

    var request = {
        parameters:{
            type: 'PAYMENT_SUCCESS',
            period: period,
            attributes:{
                first: true
            },
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            groups: groups,
            ttl: ttl
        }
    };

    return processorRequest('events',request)
        .then(function (data) {
            return data;
        });
};


statisticsMethods.getFirstPaymentsAmountOnPeriod = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var groups = parameters.get('groups');
    var period = parameters.get('period');

    var request = {
        parameters:{
            type: 'PAYMENT_SUCCESS',
            period: period,
            attribute: 'amount',
            attributes:{
                first: true
            },
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            groups: groups,
            ttl: ttl
        }
    };

    return processorRequest('summAttributeEvents',request)
        .then(function (data) {
            return data;
        });
};


statisticsMethods.getPaymentViewersOnPeriod = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var groups = parameters.get('groups');
    var period = parameters.get('period');

    var request = {
        parameters:{
            type: 'PAYMENT_POPUP',
            uniques: true,
            period: period,
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            groups: groups,
            ttl: ttl
        }
    };

    return processorRequest('events',request)
        .then(function (data) {
            return data;
        });
};


statisticsMethods.getChannelBlockedOnPeriod = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var groups = parameters.get('groups');
    var period = parameters.get('period');

    var request = {
        parameters:{
            type: 'CHANNEL_BLOCKED',
            uniques: true,
            period: period,
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            groups: groups,
            ttl: ttl
        }
    };

    return processorRequest('events',request)
        .then(function (data) {
            return data;
        });
};

statisticsMethods.getChannelStalledOnPeriod = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var groups = parameters.get('groups');
    var period = parameters.get('period');

    var request = {
        parameters:{
            type: 'CHANNEL_STALL',
            uniques: true,
            period: period,
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            groups: groups,
            ttl: ttl
        }
    };

    return processorRequest('events',request)
        .then(function (data) {
            return data;
        });
};

statisticsMethods.getCDNVIDEOBandwidth = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var period = parameters.get('period');

    var request = {
        parameters:{
            period: period,
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            source: 4,
            ttl: ttl
        }
    };

    return processorRequest('sourcestat',request)
        .then(function (data) {
            return data.map(function (element) {
                element.count = element.bandwidth;
                element.count = element.count/(1024*1024);
                return element;
            });
        });
};

statisticsMethods.getCDNNOWTraffic = function(parameters) {
    var startDate = parameters.get('startDate');
    var endDate = parameters.get('endDate');
    var period = parameters.get('period');

    var request = {
        parameters:{
            period: period,
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            source: 3,
            ttl: ttl
        }
    };

    return processorRequest('sourcestat',request)
        .then(function (data) {
            return data.map(function (element) {
                element.count = element.traffic;
                element.count = element.count/(1024*1024*1024);
                return element;
            });
        });
};
