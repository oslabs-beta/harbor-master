"use strict";
var getMetrics = function (rawData, dataType) {
    var cpuUsagePoints = [];
    rawData['timeSeries'].forEach(function (series) {
        series['points'].forEach(function (point) {
            switch (dataType) {
                case 'int64Value': {
                    cpuUsagePoints.push(point.value.int64Value);
                    break;
                }
                case 'doubleValue': {
                    cpuUsagePoints.push(point.value.doubleValue);
                    break;
                }
            }
        });
    });
    return cpuUsagePoints;
};
module.exports = getMetrics;
