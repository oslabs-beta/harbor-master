"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getMetrics = require('../utility_functions/extract_metrics');
require('dotenv').config();
var metrics_controller = {
    getMemoryUsage: function (req, res, next) {
        var cpuMetricRequest = "https://monitoring.googleapis.com/v3/projects/k8-test-428619/timeSeries?filter=metric.type=\"compute.googleapis.com/instance/memory/balloon/ram_used\"&interval.startTime=".concat(req.params.startTime, "&interval.endTime=").concat(req.params.endTime);
        fetch(cpuMetricRequest, {
            headers: { Authorization: "Bearer ".concat(process.env.token) }
        })
            .then(function (resp) { return resp.json(); })
            .then(function (json) {
            res.json(getMetrics(json, 'int64Value'));
        });
        next();
    },
    getCpuUsagePercentage: function (req, res, next) {
        var cpuMetricRequest = "https://monitoring.googleapis.com/v3/projects/k8-test-428619/timeSeries?filter=metric.type%3D%22compute.googleapis.com%2Finstance%2Fcpu%2Futilization%22&interval.startTime=".concat(req.params.startTime, "&interval.endTime=").concat(req.params.endTime);
        fetch(cpuMetricRequest, {
            headers: { Authorization: "Bearer ".concat(process.env.token) }
        })
            .then(function (resp) { return resp.json(); })
            .then(function (json) {
            res.json(getMetrics(json, 'doubleValue'));
        });
        next();
    },
    getTotalMemory: function (req, res, next) {
        var cpuMetricRequest = "https://monitoring.googleapis.com/v3/projects/k8-test-428619/timeSeries?filter=metric.type=\"compute.googleapis.com/instance/memory/balloon/ram_size\"&interval.startTime=".concat(req.params.startTime, "&interval.endTime=").concat(req.params.endTime);
        fetch(cpuMetricRequest, {
            headers: { Authorization: "Bearer ".concat(process.env.token) }
        })
            .then(function (resp) { return resp.json(); })
            .then(function (json) {
            res.json(getMetrics(json, 'int64Value'));
        });
        next();
    },
    getCores: function (req, res, next) {
        var cpuMetricRequest = "https://monitoring.googleapis.com/v3/projects/k8-test-428619/timeSeries?filter=metric.type=\"compute.googleapis.com/instance/cpu/reserved_cores\"&interval.startTime=".concat(req.params.startTime, "&interval.endTime=").concat(req.params.endTime);
        fetch(cpuMetricRequest, {
            headers: { Authorization: "Bearer ".concat(process.env.token) }
        })
            .then(function (resp) { return resp.json(); })
            .then(function (json) {
            console.log(JSON.stringify(json, null, 4));
            res.json(getMetrics(json, 'doubleValue'));
        });
        next();
    },
};
module.exports = metrics_controller;
