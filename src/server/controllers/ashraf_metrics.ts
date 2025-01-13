import express, { Request, Response, NextFunction } from 'express';
const getMetrics = require('../utility_functions/extract_metrics');
require('dotenv').config();
const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');


async function listNodePools(fileName:string) {
  const keyFilename = fileName;
  try {
    // Load the service account credentials
    const auth = new GoogleAuth({
      keyFile: keyFilename,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    // Obtain an access token for the service account
    const client = await auth.getClient();
    const accessToken = (await client.getAccessToken()).token;
    console.log()
    console.log('this is token->', accessToken);
  } catch (err) {
    console.error('Error listing node pools:', err);
  }
}

const metrics_controller : { getMemoryUsage : any, getCpuUsagePercentage: any, getTotalMemory : any, getCores : any } = {
    
    getMemoryUsage : (req: Request, res: Response, next: NextFunction) => {
        const key = listNodePools(req.body.filename)
        console.log(key);
        const cpuMetricRequest = `https://monitoring.googleapis.com/v3/projects/${req.body.project}/timeSeries?filter=metric.type="compute.googleapis.com/instance/memory/balloon/ram_used"&interval.startTime=${req.params.startTime}&interval.endTime=${req.params.endTime}`
        fetch(cpuMetricRequest, {
          headers: {Authorization : `Bearer ${key}`}
        })
           .then((resp: { json: () => any; }) => resp.json())
           .then((json: any) => {
            //console.log('data: ', JSON.stringify(json, null, 4));
            res.json(getMetrics(json, 'int64Value', 'Memory Usage'));
          })
          .catch(e => {
            console.log('error: ', e)
        })
        next();

    },
    getCpuUsagePercentage : (req: Request, res: Response, next: NextFunction) => {
        const key = listNodePools(req.body.filename)
        const cpuMetricRequest = `https://monitoring.googleapis.com/v3/projects/${req.body.project}/timeSeries?filter=metric.type%3D%22compute.googleapis.com%2Finstance%2Fcpu%2Futilization%22&interval.startTime=${req.params.startTime}&interval.endTime=${req.params.endTime}`
        fetch(cpuMetricRequest, {
            headers: {Authorization : `Bearer ${key}`}
        })
            .then((resp: { json: () => any; }) => resp.json())
            .then((json: any) => {
            //console.log('data: ', JSON.stringify(json, null, 4));
            res.json(getMetrics(json, 'doubleValue', 'CPU Usage'));
            })
            .catch(e => {
                console.log('error: ', e)
            })
        next();

    },

    getTotalMemory : (req: Request, res: Response, next: NextFunction) => {
        const key = listNodePools(req.body.filename)
        const cpuMetricRequest = `https://monitoring.googleapis.com/v3/projects/${req.body.project}/timeSeries?filter=metric.type="compute.googleapis.com/instance/memory/balloon/ram_size"&interval.startTime=${req.params.startTime}&interval.endTime=${req.params.endTime}`
        fetch(cpuMetricRequest, {
            headers: {Authorization : `Bearer ${key}`}
        })
            .then((resp: { json: () => any; }) => resp.json())
            .then((json: any) => {
            //console.log('data: ', JSON.stringify(json, null, 4));
            res.json(getMetrics(json, 'int64Value','Total Memory Per Instance'));
            })
            .catch(e => {
                console.log('error: ', e)
            })
        next();
    },

    getCores : (req: Request, res: Response, next: NextFunction) => {
        const key = listNodePools(req.body.filename)
        const cpuMetricRequest = `https://monitoring.googleapis.com/v3/projects/${req.body.project}/timeSeries?filter=metric.type="compute.googleapis.com/instance/cpu/reserved_cores"&interval.startTime=${req.params.startTime}&interval.endTime=${req.params.endTime}`
        fetch(cpuMetricRequest, {
            headers: {Authorization : `Bearer ${key}`}
        })
            .then((resp: { json: () => any; }) => resp.json())
            .then((json: any) => {
            //console.log(JSON.stringify(json, null, 4));
            res.json(getMetrics(json, 'doubleValue', 'Cores Per Instance'));
            })
            .catch(e => {
                console.log('error: ', e)
            })
        next();
    },
}

module.exports = metrics_controller;



