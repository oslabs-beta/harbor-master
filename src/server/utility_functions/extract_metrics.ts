const getMetrics = (rawData: any, dataType: string) => {
    const cpuUsagePoints: any[] = [];
    rawData['timeSeries'].forEach((series: { [x: string]: { value: { int64Value: any; doubleValue: any; }; }[]; }) => {
      series['points'].forEach(point => {
        switch(dataType){
          case 'int64Value':{
            cpuUsagePoints.push(point.value.int64Value);
            break;
          }
          case 'doubleValue':{
            cpuUsagePoints.push(point.value.doubleValue);
            break;
          }
        }
      });
    });
    return cpuUsagePoints;
  };
  module.exports = getMetrics;
  