import React from "react";
import { Metric } from './Metric';
import { useState, useEffect } from "react";
import { CpuUsage } from "./CpuUsage";
import { MemoryUsage } from "./MemoryUsage";

export function App() {
  // const [cpuUsageData, setCpuUsageData] = useState([[]]);
  // const cpuUsageOptions = {
  //   chart: {
  //     title: "Cpu Usage Percentage",
  //     subtitle: "Over Time",
  //   },
  // };
  // useEffect(() => {
  //   fetch("/metrics/cpuUsagePercentage/2024-07-16T00:00:00Z/2024-07-17T00:00:00Z")
  //     .then(res => res.json())
  //     .then(data => {
  //     console.log('data from backend: ', data);
  //     setCpuUsageData(data);
      
  // })
  // .catch(e => console.log('error retreiving data from back end server'));
  // },[]);

  return (
    // <Metric
    //   chartType="Line"
    //   width="100%"
    //   height="400px"
    //   data={cpuUsageData}
    //   options={cpuUsageOptions}
    // />
    <>
    <CpuUsage/>
    <MemoryUsage/>
    </>
  );
}
