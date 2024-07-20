import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
require('dotenv').config();
console.log('current token: ', process.env.token);
const fetch = require('node-fetch');
const app = express();

app.use(express.static(path.join(__dirname, '../../public')));
const ashraf_metrics = require('./routes/ashraf_routes');

app.use('/metrics', ashraf_metrics);

// const getMetrics = (rawData: any, dataType: string) => {
//   const cpuUsagePoints: any[] = [];
//   rawData['timeSeries'].forEach((series: { [x: string]: { value: { int64Value: any; doubleValue: any; }; }[]; }) => {
//     series['points'].forEach(point => {
//       switch(dataType){
//         case 'int64Value':{
//           cpuUsagePoints.push(point.value.int64Value);
//           break;
//         }
//         case 'doubleValue':{
//           cpuUsagePoints.push(point.value.doubleValue);
//           break;
//         }
//       }
//     });
//   });
//   return cpuUsagePoints;
// };

// const startTime = '2024-07-16T00:00:00Z';
// const endTime = '2024-07-16T00:01:00Z';
// const token = `ya29.c.c0ASRK0GYnkhvkpvLcgtkiwxOgv-NM7_tkWkukWmVFZSZRE4ERYiMFu3jPNVMNZVbHKBkG454l-2gRP34Is4T_G33VlVHQ-8dwLNW0IJXYblVtS2C3RCo5CwuEUBFiRFfeYM5IBXyD-gmgXnH44uQm5ZFZUffHUjCb8IUZ3WAl8ntTFCpQb0sY_h9LdR0nPQgL1o08PgNpKoWy9q6z4PivJQfdmPQiiKWHxOi3PiOrHaJFYdBeztIBCesQ7C8RTLehSElBYdxyTNEgMqj7mNiszYX-fpDWjeyjvRKRKyzjAHlHDkQmBaCQZa0Gmx6FVWz_iuo8LdRn2NzQ-QwcujMcPlm9CeEcPlFJATMV7EHEC8cObGJM4_kPLaQL384Ag8v4vxud7U6ZIS7siebgw53Buzb0x_g2swrSmnfWI0uf1f3-Vnee7x6ZcqVS6_nsmQF_wV8i3a4QFR4cqcptVttOxSZUi5woX3BUMpSY09XnvBvl5ijXm7QX7htbzdmezsW5JJu2OWI4vllQ5rseYFZpbIrhpzavoZ5kYkI162tRtRr_ryJpuqVadIneXBiex4yIJby-OhQ_oJiajj1Mk6FmFcSYXxsOikc-R22s8_lF4Q9R0is3ptFnlrly6coS85zM8bRkWsRhXulF1dQrf7pjuukUv5xUwB26ipQM77c3_SQf79Bngm43Rx8gnZ3QhxntogIROUwFoQRiywWZZ0vbds-5fVy3wekV4XctQq12MseJk54bc4oUkjveWgnvs3sXXMXrtRrw7XUnkUdswMOljs806U2sWznzg1a3qnU0Yb33y1_oUVRintpJ2oy0SbBXZpn05V6hk699VxqcyfBc8ygg-36XWkxlm5mYuWi-mSn5os63czURyUyYsxvc6V9grfmn2UajQOe11kWS_sWuZ4gpJnyjyceWuZ8oXzUngv9UhFn8nar8QiB7u5lRO3Ojdn9Mu4SIrrpOZlltgpzIlUQvS2mhkw88pq6Of3nXMdaepkZuplq2dtm`;
// const url = `https://monitoring.googleapis.com/v3/projects/k8-test-428619/timeSeries?filter=metric.type%3D%22compute.googleapis.com%2Finstance%2Fcpu%2Fusage_time%22&interval.startTime=${startTime}&interval.endTime=${endTime}`;
// const headers = {Authorization : `Bearer ${token}`};


// app.get('/', (req: Request, res: Response, next: NextFunction): void => {
//   try {
//     res.send('index.html');
//   } catch (error) {
//     next(error);
//   }
// });



// app.get('/cpuUsagePercentage/:startTime/:endTime', (req: Request, res: Response) => {
//   const cpuMetricRequest = `https://monitoring.googleapis.com/v3/projects/k8-test-428619/timeSeries?filter=metric.type%3D%22compute.googleapis.com%2Finstance%2Fcpu%2Futilization%22&interval.startTime=${req.params.startTime}&interval.endTime=${req.params.endTime}`
//   fetch(cpuMetricRequest, {
//     headers: headers
//   })
//      .then((resp: { json: () => any; }) => resp.json())
//      .then((json: any) => {

//       res.json(getMetrics(json, 'doubleValue'));
//     })
// });

// app.get('/memoryUsage/:startTime/:endTime', (req: Request, res: Response) => {
//   const cpuMetricRequest = `https://monitoring.googleapis.com/v3/projects/k8-test-428619/timeSeries?filter=metric.type="compute.googleapis.com/instance/memory/balloon/ram_used"&interval.startTime=${req.params.startTime}&interval.endTime=${req.params.endTime}`
//   fetch(cpuMetricRequest, {
//     headers: headers
//   })
//      .then((resp: { json: () => any; }) => resp.json())
//      .then((json: any) => {
//       res.json(getMetrics(json, 'int64Value'));
//     })
// });

// app.get('/totalMemory/:startTime/:endTime', (req: Request, res: Response) => {
//   const cpuMetricRequest = `https://monitoring.googleapis.com/v3/projects/k8-test-428619/timeSeries?filter=metric.type="compute.googleapis.com/instance/memory/balloon/ram_size"&interval.startTime=${req.params.startTime}&interval.endTime=${req.params.endTime}`
//   fetch(cpuMetricRequest, {
//     headers: headers
//   })
//      .then((resp: { json: () => any; }) => resp.json())
//      .then((json: any) => {
//       res.json(getMetrics(json, 'int64Value'));
//      })
// });

// app.get('/cores/:startTime/:endTime', (req: Request, res: Response) => {
//   const cpuMetricRequest = `https://monitoring.googleapis.com/v3/projects/k8-test-428619/timeSeries?filter=metric.type="compute.googleapis.com/instance/cpu/reserved_cores"&interval.startTime=${req.params.startTime}&interval.endTime=${req.params.endTime}`
//   fetch(cpuMetricRequest, {
//     headers: headers
//   })
//      .then((resp: { json: () => any; }) => resp.json())
//      .then((json: any) => {
//       console.log(JSON.stringify(json, null, 4));
//       res.json(getMetrics(json, 'doubleValue'));
//      })
// });

app.get('/api/', (req: Request, res: Response) => {
  res.json({ AppName: 'Master-Harbor' });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
