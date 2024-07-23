import { ChildProcess } from 'child_process';
import { Request, Response, NextFunction } from 'express';
import { spawn } from 'child_process';
import { StringDecoder } from 'string_decoder';
import { runInNewContext } from 'vm';
import path from 'path';
const decoder = new StringDecoder('utf8');
var fs = require('fs');

const outputFilePath = path.join(__dirname,'../../../customer', 'output.log');
const exitFilePath = path.join(__dirname,'../../../customer', 'output.log.exit');
fs.writeFile(outputFilePath,'',()=>{});
fs.writeFile(exitFilePath,'',()=>{})
function executeInXterm(command: string, callback: (error: Error | null, output: string) => void): void {
  const fullCommand = `xterm -e "cd customer && ${command} > ${outputFilePath} 2>&1; echo $? > ${exitFilePath}"`;

  console.log(`Executing command: ${fullCommand}`);

  const child: ChildProcess = spawn(fullCommand, { shell: true });

  child.on('error', (error: Error) => {
    console.error('Error occurred in xterm:', error);
    callback(error, '');
  });

  child.on('exit', () => {
    // Read the exit code from the file
    fs.readFile(exitFilePath, 'utf8', (err: Error | null, exitCode: string | Buffer) => {
      if (err) {
        callback(err, '');
        return;
      }

      // Read the output file
      fs.readFile(outputFilePath, 'utf8', (err: Error | null, output: string | Buffer) => {
        if (err) {
          console.error('Error reading output file:', err);
          callback(err, '');
          return;
        }

        if(!output.toString().includes('Error:')) {
          callback(null, output.toString());
        } else {
          callback(new Error(`Command failed \n${output.toString().slice(output.toString().indexOf('Error:'))}`), output.toString().slice(output.toString().indexOf('Error:')));
        }
      });
    });
  });
}
function makeT(req: Request, res: Response, next: NextFunction):void{
  res.locals.bool = false;

  fs.readFile('./copy/main.tf', 'utf8', (err: Error | null, data: string) => {
    if (err) {
      console.log(err);
      return next(err);
    }

    let creds: string = req.body.saCred;
    if (typeof req.body.saCred === 'object') creds = JSON.stringify(req.body.saCred);
    
    let result = data.replace(/local.envs.APP_INSTALLATION_ID/g, req.body.appId)
      .replace(/local.envs.PROJECT_ID/g, req.body.projId)
      .replace(/local.envs.PROJECT_NUMBER/g, req.body.projNum)
      .replace(/local.envs.SA_EMAIL/g, req.body.saMail)
      .replace(/local.envs.COMPUTE_REGION/g, req.body.compR)
      .replace(/local.envs.COMPUTE_ZONE/g, req.body.compZ)
      .replace(/local.envs.SA_credentials/g, creds)
      .replace(/local.envs.GH_TOKEN/g, req.body.ghTok)
      .replace(/local.envs.GH_URL/g, req.body.ghURL);

    fs.writeFile('./customer/main.tf', result, 'utf8', (err: Error | null) => {
      if (err) {
        console.log(err);
        return next(err);
      }
    });
  });

  executeInXterm('terraform init && terraform plan', (error, output) => {
    if (error) {
      fs.unlink('terraform.tf.state',()=>{});
      fs.unlink('terraform.tf.state.backup',()=>{});
      // console.error("Error:", error.message);
      // console.error("Output:", output);
      res.locals.message = error.message;
      return next(error);
    }})
  executeInXterm('terraform apply -auto-approve', (error, output) => {
    if (error) {
      fs.unlink('terraform.tf.state',()=>{});
      fs.unlink('terraform.tf.state.backup',()=>{});
      // console.error("Error:", error.message);
      // console.error("Output:", output);
      res.locals.message = error.message;
      return next(error);
    } else {
      res.locals.bool = true;
      // console.log("Output:", output);
      return next();
    }
  });
}

export default makeT;