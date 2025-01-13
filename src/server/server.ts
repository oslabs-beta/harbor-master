import express from 'express';
import path from 'path';
import passport from 'passport'
import session from 'express-session'
const GitHubStrategy = require('passport-github').Strategy;
import cookieParser from 'cookie-parser';
import config from './config/envConfig';
import { handleError } from './controllers/errorController';
import { ProjectModel, UserModel } from './config/mongoConfig';
import EncryptionService from './services/EncryptionService';
import * as bodyParser from 'body-parser';
import clusters from './routes/clusters';
import loggerMiddleware from './middlewares/logger';
import cors from 'cors';
import { env } from 'process';
import authRouter from './routes/authRouter';
import userRouter from './routes/userRouter';
import projectRouter from './routes/projectRouter';
import { Response } from 'node-fetch';
import childProcess, { spawn, ChildProcess, exec } from 'child_process';


const getMetrics = require('../server/utility_functions/extract_metrics');

require('dotenv').config();
const fs = require('fs');
import * as https from 'https';
import { IndexDefinition } from 'mongoose';
import { Z_FIXED } from 'zlib';

const fetch = require('node-fetch');
const app = express();
const ashraf_metrics = require('./routes/ashraf_routes');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../public')));

// app.use((req, res, next) => {
//   console.log('Incoming request:', req.url);
//   console.log('Request headers:', req.headers);
//   next();
// });

app.use(cors({origin: `http://35.202.126.33:3000`,}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(loggerMiddleware);

app.use('/api/metrics', ashraf_metrics);
app.use('/api/clusters', clusters);
app.use('/api/users',userRouter);
app.use('/auth',authRouter);
app.use('/api/projects',projectRouter);

app.get('/', (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, '../../public/index.html')); // Serve the main HTML file
  } catch (error) {
    return next({
      log: 'Error sending index.html to client',
      message: { err: 'Server error loading page' },
    });
  }
});

// mock endpoint to check db, for development only
// app.get('/read-db-user', async (req, res) => {
//   const response = await UserModel.find();
//   res.json(response);
// });
// app.get('/read-db-proj', async (req, res) => {
//   const response = await ProjectModel.find();
//   res.json(response);
// });
//only for dev
// app.get('/clear-db', async (req,res) => {
//   const response = await ProjectModel.deleteMany({__v:0})
//   res.json(response);
// })

app.get('/test', async(req,res) => {

  const newUser = await UserModel.findOneAndUpdate({githubHandle:'Crossur'},{ $pull: { projects:'678448d5abaf1f62c11b72e3'} },{ new: true, useFindAndModify: false });
  // const createdProject = await ProjectModel.create({ 
  //   // userId,
  //   appInstallationId:"A",
  //   gcpProjectId:"a",
  //   gcpProjectNumber:2,
  //   gcpServiceAcctEmail:"a",
  //   gcpRegion:"a",
  //   gcpComputeZone:"a",
  //   gcpServiceAccounts:"a",
  //   deploymentOptions:"a",
  //   userOptions:"a",
  //   terraformState: null,
  //   githubToken:"a",
  //   githubUrl:"a",
  //   isDeployed:false
  // });
  // const newProject = await ProjectModel.findByIdAndDelete({_id:'6732b145ed35f4fe915250fe'});
  res.send(newUser);
})

app.get('/xterm',async(req,res)=>{
  const fullCommand = `xterm -e "terraform > output_file.txt 2>&1"`;
    const child: ChildProcess = spawn(fullCommand, { shell: true })
    child.on('close',async ()=>{

      console.log("successfully printed ls");

        return "successfully printed ls"
    })
    child.on('error',async()=>{
      console.log("error in printing ls");

      return "error in printing ls";
    })
  return res.send(200);
})

app.get('/testMetrics',async(req,res)=>{
  const key = 'ya29.c.c0ASRK0GaC9u6plS3wV7LblvmK4cVRqvyem3xpBg2ekJi0i3iEIUeq2fNN2MJONhSgKvl1PvPwk2MbdtLEHGgwEwN7bV6XItpQHUtsKmLA1prr6tSX64iDWSJlNk_V-xWXpg81c0x-6W6TnOdGc0zoQZf-sq9WwdpOPQUcYhzR5EAAThT25x2dZTKKpapg0l5Ko23gnixT8UuVpGl9oIj8IIM7ws3MBtFojpUC1FNb2XIspz1GwsRvcePY1-1a3tvIwK7mw0TCSliS1HdfPoj0zJ0Le6W4Iqhb63kUHxde-6ASHemWRaMUiOFsusAnUV5M2KzgWuv7wNFxabVfE0FDf_ydMmjsW3QsyQlCWfIq-trimu5_4YABc0SHuoTK1y_v9ZvFwTOituFDm1WzHO1tgs1aS2zOVveQVsUM72H1aJFqcr2fGeNX3ldIIQlX-CFhXtRBzIo3ZXMRc2rcc4Ydo8QmV-MCczzK3iRO4pefdBSVo9-XWTaj6jAquJROOj5D9Kl32hxKZv6ukQOh4KTVMJpinkCIr3MtlJp6rMXKWK_CXKtvyAdRa45YgaC2RSn2pWtHueeU1UBLT-GvGQw0xzAJkpwgl-zf-9fg-59fPv6WNprBDVkH636AYSO7hJOqfM_InxI7hRtIdutStnoh_gO5oymW45X7YJqYeU6bhvmwhX8o29-ZRFYdIertUF_8ZOq3q3ZO1nf-QJcSBh1jqhqIM97x5WnvJy_IbQiea4XY21Qfh15wRpMtly_o-vShdMzu8YaipI0cw7zFSWnvpyepYIaRtZWvSJ10e19cQksSWrxvq2-FSsVqxubtjQy862fheIVcoXyzS6ZjVkRece0-QVfUnpi1e-MmdR86dymJwylFMt-ozURedeaguzh_Rxn6IOfWanfSI-yzWnW8tU8W0g9c6jieZxneZUfR0zq-lnUha_9c4JoX3bg-oRUon2i2m0BxFVMQvkg8jBY6za0WzFR2zzhxky0d02niexhuoo1tqUdrwZg';

  const cpuMetricRequest = `https://monitoring.googleapis.com/v3/projects/harbor-master-t/timeSeries?filter=metric.type="compute.googleapis.com/instance/memory/balloon/ram_used"&interval.startTime=2024-09-01T00:00:00Z&interval.endTime=${new Date().toISOString()}`;
  fetch(cpuMetricRequest, {
    headers: {Authorization : `Bearer ${key}`}
  })
     .then((resp: { json: () => any; }) => resp.json())
     .then((json: any) => {
      console.log('data: ', JSON.stringify(json, null, 4));
      res.json(getMetrics(json, 'int64Value', 'Memory Usage'));
    });
})

interface ServiceAccountFile{
  name: string
  type: string
  project_id: string
  private_key_id: string
  private_key: string
  client_email: string
  client_id: string
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  client_x509_cert_url: string
  universe_domain:string
}

// global error handling
app.use(handleError);

app.use((req, res) => {res.sendFile(path.join(__dirname, '../../public', 'index.html'))});

app.listen(config.port, () => {
  console.log(`App listening on port ${config.port}`);
});
