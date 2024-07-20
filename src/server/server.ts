import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
require('dotenv').config();

const fetch = require('node-fetch');
const app = express();
const startTime = '2024-07-16T00:00:00Z';
const endTime = '2024-07-16T00:01:00Z';
const token = `ya29.c.c0ASRK0GbYD37f_-BznGTgFZUBbo_7-Vty4nsHOJzG6nDv-WE7_FOZz50Eb7uoyqv0ssqE-Nk4VGCsqu-QmoR3GCdoOiWZVMvM1HxDjQ5Y5uecWm6jETB2MmnD-jI8i5CD8M3XV_s0QOaiX4PKcl-M5pIYunnybazJYrvClxCxyf84w3CZTPCQ6cpoSCtKkhlNG7SZAKxA_dsTV0Dr81jo4ZIJW1vgowlSCqePasb-ovDuesI8YILzUUlDzmEJWz3QdQFlr73p2vEgQatx4jgHS2co4HkxiOCKSzdjpFlZaAqbF0iZYw9-74VBeLm6RHeP35aA5KqZ2E4VcLjoxWa0fHWYd1YDFv7h9XboxvuYUF47PKBLc043rTk78QG387Ci6RclWurnOBzciJMymqFhMnbBi4qc49aas-8I9ZjoZ7I07n3lZvWUrhbXp1zmogQa4esun67V0xXUQFgguView5fxn2xw4xhqd7ytIfSBxofR2gQ-UUubrlVs5B4_9eep8ym8u3iFbaBVisgB1fe3Or9iyXri3FjrcBoedctojd9Z78VSVRW2MdullW1JUJw-Qr0567_1QIzWWb23wj7we5fczadzym39fRozjqY9OO0y_JM3IZqzkkjyplpQxl_w4-yOW2ta8fUO_4vO9znSI6n1QzVqVXxgtWnmOaWFy14qgj3ztuSlXQnZ01s0iM5cSq0WJRIlWR1_4JFS94UY1y-3OrUVrakxIpn1dMtv9QZFrZnJ5eia8Ve-teu9645xx42W5XSISgegOttQ87biveZw3ZQzVbfaZmWM6FdsJBl0cxvgdqsXUOUuYS102VkR3dx0q_y676ty6ZYXoS5UXXVcIVfqrUdbUm9p440r3x9ge09lm_9dcji_I7pUxfzkz7oiXQc64wcsxw7bUi67sWz-Uk7er6y4xVZ70aJ260lUye_pXm0oM9Sv-SV1JOty5SjlOiRkpwxp-5OXdzc5nhVlk1hiurM7k5Q38gFsYnddc2jf1V3pY_c`;
const url = `https://monitoring.googleapis.com/v3/projects/k8-test-428619/timeSeries?filter=metric.type%3D%22compute.googleapis.com%2Finstance%2Fcpu%2Fusage_time%22&interval.startTime=${startTime}&interval.endTime=${endTime}`;
const headers = {Authorization : `Bearer ${token}`};

// fetch(url, {
//   headers: headers
// })
//    .then((resp: { json: () => any; }) => resp.json())
//    .then((json: any) => console.log(JSON.stringify(json, null, 4)))

app.use(express.static(path.join(__dirname, '../../public')));

// app.get('/', (req: Request, res: Response, next: NextFunction): void => {
//   try {
//     res.send('index.html');
//   } catch (error) {
//     next(error);
//   }
// });

app.get('/cpuUsagePercentage/:startTime/:endTime', (req: Request, res: Response) => {
  const cpuMetricRequest = `https://monitoring.googleapis.com/v3/projects/k8-test-428619/timeSeries?filter=metric.type%3D%22compute.googleapis.com%2Finstance%2Fcpu%2Futilization%22&interval.startTime=${req.params.startTime}&interval.endTime=${req.params.endTime}`
  fetch(cpuMetricRequest, {
    headers: headers
  })
     .then((resp: { json: () => any; }) => resp.json())
     .then((json: any) => res.json(JSON.stringify(json, null, 4)))

  //res.json({ 'cpuUsage': 'cpuUsageData' });
});

app.get('/memoryUsage/:startTime/:endTime', (req: Request, res: Response) => {
  const cpuMetricRequest = `https://monitoring.googleapis.com/v3/projects/k8-test-428619/timeSeries?filter=metric.type="compute.googleapis.com/instance/memory/balloon/ram_used"&interval.startTime=${req.params.startTime}&interval.endTime=${req.params.endTime}`
  fetch(cpuMetricRequest, {
    headers: headers
  })
     .then((resp: { json: () => any; }) => resp.json())
     .then((json: any) => res.json(JSON.stringify(json, null, 4)))

  //res.json({ 'cpuUsage': 'cpuUsageData' });
});

app.get('/api/', (req: Request, res: Response) => {
  res.json({ AppName: 'Master-Harbor' });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
