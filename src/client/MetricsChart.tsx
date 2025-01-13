import e from 'express';
import React from 'react';
import { Chart } from 'react-google-charts';
import Plot from 'react-plotly.js';

interface Point {
  interval: {
    startTime: string;
    endTime: string;
  };
  value: {
    int64Value: string | null;
    doubleValue:number | null;
  };
}

interface TimeSeries {
  metric: {
    type: string;
    labels: {
      instance_name: string;
    };
  };
  resource: {
    type: string;
    labels: {
      project_id: string;
      instance_id: string;
      zone: string;
    };
  };
  points: Point[];
}

interface MetricsChartProps {
  timeSeries: TimeSeries[];
  type: string;
}

const MetricsChart: React.FC<MetricsChartProps> = ({ timeSeries, type }) => {
  if (timeSeries) {
    // Flatten and format data for Google Charts
    let dataPoints: [Date, number][] = [];

    const aggregateDataByInterval = (data: [Date, number][], intervalMs: number) => {
      const aggregated: { [key: string]: [Date, number][] } = {};
    
      data.forEach(([date, value]) => {
        if (value < 0) return; // Ignore negative values
        const bucket = Math.floor(date.getTime() / intervalMs); // Group by time interval
        if (!aggregated[bucket]) {
          aggregated[bucket] = [];
        }
        aggregated[bucket].push([date, value]);
      });
    
      return Object.values(aggregated).map((bucket) => {
        // Compute initial average for the bucket
        const initialAvg = bucket.reduce((sum, [, val]) => sum + val, 0) / bucket.length;
    
        // Filter out values greater than 10 times the average
        const filteredBucket = bucket.filter(([, val]) => val <= 10 * initialAvg);
    
        // Recompute average with filtered values
        const avgValue = filteredBucket.reduce((sum, [, val]) => sum + val, 0) / filteredBucket.length;
    
        // Return the first date in the bucket and the new average value
        return [bucket[0][0], avgValue] as [Date, number];
      });
    };

    const isReasonableMetricValue = (value: number) => value >= 2;

    if (type === 'cpu') {
      // Handle CPU Utilization (convert to percentage)
      dataPoints = timeSeries.flatMap((series: TimeSeries): [Date, number][] =>
        series.points
          .map((point: Point): [Date, number] => [
            new Date(point.interval.startTime),
            parseFloat(`${point.value.doubleValue}`) * 100
          ])
          // Filter out unreasonable CPU utilization values
          .filter(([, value]) => isReasonableMetricValue(value))
      ).sort((a: [Date, number], b: [Date, number]) => a[0].getTime() - b[0].getTime());

    } else {
      // Handle other metrics (use int64Value)
      dataPoints = timeSeries.flatMap((series: TimeSeries): [Date, number][] =>
        series.points
          .map((point: Point): [Date, number] => [
            new Date(point.interval.startTime),
            parseInt(point.value.int64Value!, 10)
          ])
          .filter(([, value]) => isReasonableMetricValue(value))
      ).sort((a: [Date, number], b: [Date, number]) => a[0].getTime() - b[0].getTime());
    }

    dataPoints = aggregateDataByInterval(dataPoints,(15*60*1000));

    const data = [
      ['Time', getMetricLabel(type)],
      ...dataPoints
    ];

    // Dynamic options based on type
    const options = getChartOptions(type);

    return (
      <Chart
        className='bg-dark-gray'
        chartType="LineChart"
        data={data}
        options={options}
        width="100%"
        height="350px"
      />
    );
  } else {
    return <></>;
  }
};

// Function to determine the label for the metric based on the type
const getMetricLabel = (type: string): string => {
  switch (type) {
    case 'memory':
      return 'Memory Usage (bytes)';
    case 'cpu':
      return 'CPU Utilization (%)';
    case 'diskWrite':
      return 'Disk Write (bytes)';
    case 'diskRead':
      return 'Disk Read (bytes)';
    case 'networkEgress':
      return 'Network Egress (bytes)';
    default:
      return 'Value';
  }
};

// Function to get chart options based on the type
const getChartOptions = (type: string) => {
  switch (type) {
    case 'memory':
      return {
        title: 'Memory Usage Over Time',
        curveType: 'function',
        legend: { position: 'bottom' },
        hAxis: {
          title: 'Time',
          format: 'yyyy-MM-dd HH:mm:ss',
          viewWindowMode: 'pretty',
        },
        vAxis: {
          title: 'Memory Usage (bytes)',
          format: 'short',
          viewWindowMode: 'pretty',
        },
        series: {
          0: { color: '#FF5733' },
        },
      };
    case 'cpu':
      return {
        title: 'CPU Utilization Over Time',
        curveType: 'function',
        legend: { position: 'bottom' },
        hAxis: {
          title: 'Time',
          format: 'yyyy-MM-dd HH:mm:ss',
          viewWindowMode: 'pretty',
        },
        vAxis: {
          title: 'CPU Utilization (%)',
          format: 'short',
          viewWindowMode: 'pretty',
        },
        series: {
          0: { color: '#33FF57' },
        },
      };
    case 'diskWrite':
      return {
        title: 'Disk Write Over Time',
        curveType: 'function',
        legend: { position: 'bottom' },
        hAxis: {
          title: 'Time',
          format: 'yyyy-MM-dd HH:mm:ss',
          viewWindowMode: 'pretty',
        },
        vAxis: {
          title: 'Disk Write (bytes)',
          format: 'short',
          viewWindowMode: 'pretty',
        },
        series: {
          0: { color: '#3357FF' },
        },
      };
    case 'diskRead':
      return {
        title: 'Disk Read Over Time',
        curveType: 'function',
        legend: { position: 'bottom' },
        hAxis: {
          title: 'Time',
          format: 'yyyy-MM-dd HH:mm:ss',
          viewWindowMode: 'maximized',
        },
        vAxis: {
          title: 'Disk Read (bytes)',
          format: 'short',
          viewWindowMode: 'maximized',
        },
        series: {
          0: { color: '#FF33A6' },
        },
      };
    case 'networkEgress':
      return {
        title: 'Network Egress Over Time',
        curveType: 'function',
        legend: { position: 'bottom' },
        hAxis: {
          title: 'Time',
          format: 'yyyy-MM-dd HH:mm:ss',
          viewWindowMode: 'pretty',
        },
        vAxis: {
          title: 'Network Egress (bytes)',
          format: 'short',
          viewWindowMode: 'pretty',
        },
        series: {
          0: { color: '#FFBF00' },
        },
      };
    default:
      return {
        title: 'Metrics Over Time',
        curveType: 'function',
        legend: { position: 'bottom' },
        hAxis: {
          title: 'Time',
          format: 'yyyy-MM-dd HH:mm:ss',
          viewWindowMode: 'pretty',
        },
        vAxis: {
          title: 'Value',
          format: 'short',
          viewWindowMode: 'pretty',
        },
        series: {
          0: { color: '#000000' },
        },
        pointsVisible: true
      };
  }
};


export default MetricsChart;
