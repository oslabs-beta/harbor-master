//  controller file
import express, { Request, Response, NextFunction } from 'express';
const getMetrics = require('../utility_functions/extract_metrics');
require('dotenv').config();

const metrics_controller : { getMemoryUsage : any, getCpuUsagePercentage: any, getTotalMemory : any, getCores : any } = {
    
    getMemoryUsage : (req: Request, res: Response, next: NextFunction) => {
        const cpuMetricRequest = `https://monitoring.googleapis.com/v3/projects/k8-test-428619/timeSeries?filter=metric.type="compute.googleapis.com/instance/memory/balloon/ram_used"&interval.startTime=${req.params.startTime}&interval.endTime=${req.params.endTime}`
        fetch(cpuMetricRequest, {
          headers: {Authorization : `Bearer ${process.env.token}`}
        })
           .then((resp: { json: () => any; }) => resp.json())
           .then((json: any) => {
            res.json(getMetrics(json, 'int64Value', 'Memory Usage'));
          })
        next();

    },
    getCpuUsagePercentage : (req: Request, res: Response, next: NextFunction) => {
        
        const cpuMetricRequest = `https://monitoring.googleapis.com/v3/projects/k8-test-428619/timeSeries?filter=metric.type%3D%22compute.googleapis.com%2Finstance%2Fcpu%2Futilization%22&interval.startTime=${req.params.startTime}&interval.endTime=${req.params.endTime}`
        fetch(cpuMetricRequest, {
            headers: {Authorization : `Bearer ${process.env.token}`}
        })
            .then((resp: { json: () => any; }) => resp.json())
            .then((json: any) => {
            //console.log('data: ', JSON.stringify(json, null, 4));
            res.json(getMetrics(json, 'doubleValue', 'CPU Usage'));
            })
        next();

    },

    getTotalMemory : (req: Request, res: Response, next: NextFunction) => {
        const cpuMetricRequest = `https://monitoring.googleapis.com/v3/projects/k8-test-428619/timeSeries?filter=metric.type="compute.googleapis.com/instance/memory/balloon/ram_size"&interval.startTime=${req.params.startTime}&interval.endTime=${req.params.endTime}`
        fetch(cpuMetricRequest, {
            headers: {Authorization : `Bearer ${process.env.token}`}
        })
            .then((resp: { json: () => any; }) => resp.json())
            .then((json: any) => {
            res.json(getMetrics(json, 'int64Value','Total Memory Per Instance'));
            })
        next();
    },

    getCores : (req: Request, res: Response, next: NextFunction) => {
        const cpuMetricRequest = `https://monitoring.googleapis.com/v3/projects/k8-test-428619/timeSeries?filter=metric.type="compute.googleapis.com/instance/cpu/reserved_cores"&interval.startTime=${req.params.startTime}&interval.endTime=${req.params.endTime}`
        fetch(cpuMetricRequest, {
            headers: {Authorization : `Bearer ${process.env.token}`}
        })
            .then((resp: { json: () => any; }) => resp.json())
            .then((json: any) => {
            //console.log(JSON.stringify(json, null, 4));
            res.json(getMetrics(json, 'doubleValue', 'Cores Per Instance'));
            })
        next();
    },
}

module.exports = metrics_controller;



