// const getMetrics = (rawData: any, dataType: string) => {
//     const cpuUsagePoints: any[] = [[],[]];
//     let point = 1;
//     rawData['timeSeries'].forEach((series: { [x: string]: {  value: { int64Value: any; doubleValue: any; }; }[]; }) => {

import { cpuUsage } from "process";

      
//       series['points'].forEach(point => {
//         switch(dataType){
//           case 'int64Value':{
//             cpuUsagePoints.push(point.value.int64Value);
//             break;
//           }
//           case 'doubleValue':{
//             cpuUsagePoints.push(point.value.doubleValue);
//             break;
//           }
//         }
//       });
//     });
//     return cpuUsagePoints;
//   };

  export interface points {
    'interval':{'startTime':string, 'endTime':string},
    'value':{'doubleValue':string, 'int64Value':string}
  };

  export interface series {
    'metric' : { 'labels': {'instance_name':string}, 'type':string},
    'resource': { 'type':string, 'labels':{'instance_id':string, 'zone':string, 'project_id':string}},
    'metricKind':string,
    'valueType':string,
    'points': points[]
  };
  export interface cpuUsage {
    'timeSeries':series[]
  };
  
  


  const getMetrics = (rawData: cpuUsage, dataType:string, metricType: string) => {
    const instances: string[] = [];
    const points_array: string[][] = [];
    const processed_points: any[][] = [];
    rawData['timeSeries'].forEach(series => {
      //console.log('series: ', series);
      let metric_points: string[] = [];
      //console.log('series.metric: ', series.metric);
      instances. push(series.metric.labels.instance_name);
      series.points.forEach(point => {
        switch(dataType){
          case 'doubleValue':
            //console.log('doubleValue value: ', point.value.doubleValue);
            metric_points.push(point.value.doubleValue);
            break;

            case 'int64Value':
            //console.log('int64Value value: ', point.value.int64Value);
            metric_points.push(point.value.int64Value);
            break;


        }
        
      });
      points_array.push([...metric_points]);

    });
    //console.log('instances: ', instances);
    //console.log('points: ', points_array);
    processed_points.push([metricType,...instances]);
    for(let colomn = 0; colomn < points_array[0].length; colomn++){
      let temp_array: Number[] = [];
      for(let row = 0; row < points_array.length; row++){
        temp_array.push(Number(points_array[row][colomn]));

      }
      processed_points.push([colomn+1, ...temp_array]);


    }
    console.log('processed_points: ', processed_points);
    return processed_points;

  };

  module.exports = getMetrics;
  