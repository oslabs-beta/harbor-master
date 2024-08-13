import { DiffieHellmanGroup } from 'crypto';
import React, { MouseEventHandler } from 'react';
import {useState,useEffect} from 'react'
const App: React.FC = () => {
  let test:MouseEventHandler = async ()=>{
    fetch('/test',{
      method:'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify(
        {
          "appId":(document.getElementById("appId") as HTMLInputElement).value,
          "projId":(document.getElementById("projId") as HTMLInputElement).value,
          "projNum":(document.getElementById("projNum") as HTMLInputElement).value,
          "saMail":(document.getElementById("saMail") as HTMLInputElement).value,
          "compR":(document.getElementById("compR") as HTMLInputElement).value,
          "compZ":(document.getElementById("compZ") as HTMLInputElement).value,
          "saCred":(document.getElementById("saCred") as HTMLInputElement).value,
          "ghTok":(document.getElementById("ghTok") as HTMLInputElement).value,
          "ghURL":(document.getElementById("ghURL") as HTMLInputElement).value,
          "cName":(document.getElementById("cName") as HTMLInputElement).value,
          "arName":(document.getElementById("arName") as HTMLInputElement).value,
          "npName":(document.getElementById("npName") as HTMLInputElement).value,
          "nodeCount":(document.getElementById("nodeCount") as HTMLInputElement).value,
          "cbConName":(document.getElementById("cbConName") as HTMLInputElement).value,
          "cbRepName":(document.getElementById("cbRepName") as HTMLInputElement).value,
          "cbTrgName":(document.getElementById("cbTrgName") as HTMLInputElement).value,
          "branchName":(document.getElementById("branchName") as HTMLInputElement).value
        })
    });
    (document.getElementById("appId") as HTMLInputElement).value = '';
    (document.getElementById("projId") as HTMLInputElement).value = '';
    (document.getElementById("projNum") as HTMLInputElement).value = '';
    (document.getElementById("saMail") as HTMLInputElement).value = '';
    (document.getElementById("compR") as HTMLInputElement).value = '';
    (document.getElementById("compZ") as HTMLInputElement).value = '';
    (document.getElementById("saCred") as HTMLInputElement).value = '';
    (document.getElementById("ghTok") as HTMLInputElement).value = '';
    (document.getElementById("ghURL") as HTMLInputElement).value = '';
    (document.getElementById("cName") as HTMLInputElement).value = '';
    (document.getElementById("arName") as HTMLInputElement).value = '';
    (document.getElementById("npName") as HTMLInputElement).value = '';
    (document.getElementById("nodeCount") as HTMLInputElement).value = '';
    (document.getElementById("cbConName") as HTMLInputElement).value = '';
    (document.getElementById("cbRepName") as HTMLInputElement).value = '';
    (document.getElementById("cbTrgName") as HTMLInputElement).value = '';
    (document.getElementById("branchName") as HTMLInputElement).value = '';
  }
  return (
    <>
      <h1>TypeScript is awesome</h1>
      <input id="appId" placeholder="app installation id"></input>
      <input id="projId" placeholder="project id"></input>
      <input id="projNum" placeholder="project number"></input>
      <input id="saMail" placeholder="service account email"></input>
      <input id="compR" placeholder="compute region"></input>
      <input id="compZ" placeholder="compute zone"></input>
      <input id="saCred" placeholder="SA creds"></input>
      <input id="ghTok" placeholder="gh token"></input>
      <input id="ghURL" placeholder="gh url"></input>
      <input id="branchName" placeholder="github branch name"></input>
      <input id="cName" placeholder="cluster name"></input>
      <input id="arName" placeholder="artifact registry name"></input>
      <input id="npName" placeholder="node pool name"></input>
      <input id="nodeCount" placeholder="node count"></input>
      <input id="cbConName" placeholder="cloubuild connection name"></input>
      <input id="cbRepName" placeholder="cloubuild repo name"></input>
      <input id="cbTrgName" placeholder="cloudbuild trigger name"></input>
      <button id="test" onClick={test}>click to submit</button>
      <script type = "application/typescript" src="./test.ts"></script>
      <div id="my-div"></div>
    </>
  );
};

export default App;
