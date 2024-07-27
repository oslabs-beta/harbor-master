import React from "react";
import { Chart } from "react-google-charts";
import { useState, useEffect } from "react";

export function CpuUsage() {
    const [data, setData] = useState([[]]);

    useEffect(() => {
      fetch("/metrics/cpuUsagePercentage/2024-07-16T00:00:00Z/2024-07-16T00:10:00Z")
        .then(res => res.json())
        .then(data => {
        setData(data);
        
    })
    .catch(e => console.log('error retreiving cpu data from back end server'));
    },[]);

      const options = {
        chart: {
          title: "Cpu Usage Percentage",
          subtitle: "Over Time",
        },
      };

  return (
    <Chart
      chartType="Line"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
}
