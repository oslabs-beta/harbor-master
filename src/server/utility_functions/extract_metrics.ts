import { cpuUsage } from "process";

interface points {
  'interval':{'startTime':string, 'endTime':string},
  'value':{'doubleValue':string, 'int64Value':string}
};

interface series {
  'metric' : { 'labels': {'instance_name':string}, 'type':string},
  'resource': { 'type':string, 'labels':{'instance_id':string, 'zone':string, 'project_id':string}},
  'metricKind':string,
  'valueType':string,
  'points': points[]
};
interface cpuUsage {
  'timeSeries':series[]
};

const getMetrics = (rawData: cpuUsage, dataType:string, metricType: string) => {
  const instances: string[] = [];
  const points_array: string[][] = [];
  const processed_points: any[][] = [];
  rawData['timeSeries'].forEach(series => {
    let metric_points: string[] = [];
    instances. push(series.metric.labels.instance_name);
    series.points.forEach(point => {
      switch(dataType){
        case 'doubleValue':
          metric_points.push(point.value.doubleValue);
          break;

          case 'int64Value':
          metric_points.push(point.value.int64Value);
          break;


      }
      
    });
    points_array.push([...metric_points]);

  });
  processed_points.push([metricType,...instances]);
  for(let colomn = 0; colomn < points_array[0].length; colomn++){
    let temp_array: Number[] = [];
    for(let row = 0; row < points_array.length; row++){
      temp_array.push(Number(points_array[row][colomn]));

    }
    processed_points.push([colomn+1, ...temp_array]);

  }
  return processed_points;

};

module.exports = getMetrics;
