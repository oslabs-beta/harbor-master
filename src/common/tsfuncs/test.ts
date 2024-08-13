import { ChildProcess } from 'child_process';
import { Request, Response, NextFunction } from 'express';
import { spawn } from 'child_process';
import { StringDecoder } from 'string_decoder';
import path from 'path';
const decoder = new StringDecoder('utf8');
var fs = require('fs');

const outputFilePath = path.join(__dirname,'../../../customer', 'output.log');
const exitFilePath = path.join(__dirname,'../../../customer', 'output.log.exit');

function executeInXterm(command: string, callback: (error: Error | null, output: string) => void): void {
  const fullCommand = `xterm  -e "cd customer && ${command} > ${outputFilePath} 2>&1; echo $? > ${exitFilePath}"`;

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

        if (!output.toString().includes('Error:')) {
          callback(null, output.toString());
        } else {
          callback(new Error(`Command failed \n${output.toString().slice(output.toString().indexOf('Error:'))}`), output.toString().slice(output.toString().indexOf('Error:')));
        }
      });
    });
  });
}

function makeT(req: Request, res: Response, next: NextFunction): void {
  fs.writeFile(outputFilePath, '', (err: Error) => {if(err) console.log(err)});
  fs.writeFile(exitFilePath, '', (err:Error) => {if(err) console.log(err)});
  fs.readFile('./copy/main.tf', 'utf8', (err: Error | null, data: string) => {
    if (err) {
      console.log(err);
      return next(err);
    }

    let creds: string = req.body.saCred;
    if (typeof req.body.saCred === 'object') creds = JSON.stringify(req.body.saCred);

    let result = data.replace(/APP_INSTALLATION_ID/g, req.body.appId)
      .replace(/PROJECT_ID/g, req.body.projId)
      .replace(/PROJECT_NUMBER/g, req.body.projNum)
      .replace(/SA_EMAIL/g, req.body.saMail)
      .replace(/.COMPUTE_REGION/g, req.body.compR)
      .replace(/COMPUTE_ZONE/g, req.body.compZ)
      .replace(/SA_credentials/g, creds)
      .replace(/GH_TOKEN/g, req.body.ghTok)
      .replace(/GH_URL/g, req.body.ghURL)
      .replace(/cName/g, req.body.cName)
      .replace(/cName/g, req.body.cName)
      .replace(/arName/g, req.body.arName)
      .replace(/npName/g, req.body.npName)
      .replace(/nodeCount/g, req.body.nodeCount)
      .replace(/cbConName/g, req.body.cbConName)
      .replace(/cbRepName/g, req.body.cbRepName)
      .replace(/cbTrgName/g, req.body.cbTrgName)
      .replace(/branchName/g, req.body.branchName);

      

    fs.writeFile('./customer/main.tf', result, 'utf8', (err: Error | null) => {
      if (err) {
        console.log(err);
        return next(err);
      }
    });
  });

executeInXterm('terraform init && terraform plan && terraform apply -auto-approve', (error, output) => {
  if (error) {
    fs.unlink('terraform.tf.state',()=>{});
    fs.unlink('terraform.tf.state.backup',()=>{});
    res.locals.message = error.message;
    return next(error.message);
  }else{
    return next();
  }
})
}
export default makeT;
