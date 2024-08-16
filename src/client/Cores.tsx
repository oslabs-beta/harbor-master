import React from "react";
import { Chart } from "react-google-charts";
import { useState, useEffect } from "react";

export function Cores(props:any) {
    const [data, setData] = useState([[]]);

    useEffect(() => {
      fetch('http://localhost:3000/metrics/cores/' + props.from + '/' + props.from)
        .then(res => res.json())
        .then(data => {
            
            setData(data);
        
    })
    .catch(e => console.log('error retreiving cores data from back end server'));
    },[props]);

      const options = {
        chart: {
          title: "Cores Per Instance",
          subtitle: "_____",
        },
      };

  return (
    <Chart
      chartType="Table"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
}