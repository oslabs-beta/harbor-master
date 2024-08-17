// import React, { useState } from 'react';

// const Metrics: React.FC = () => {
//   const [response, setResponse] = useState<string | null>(null);
//   const handleButtonClick = async () => {
//     try {
//       const res = await fetch('http://localhost:3000/api/clusters/details'); // Replace with your backend URL
//       if (!res.ok) {
//         throw new Error(`Error: ${res.status}`);
//       }
//       const data = await res.json();
//       setResponse(JSON.stringify(data, null, 2)); // Format the response for display
//     } catch (error) {
//       setResponse(`Failed to fetch: ${(error as Error).message}`);
//     }
//   };
//   return (
//     <div>
//       <button
//         onClick={handleButtonClick}
//         className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
//       >
//         Fetch Data
//       </button>
//       {response && (
//         <pre className='mt-4 p-4 bg-gray-100 rounded border border-gray-300'>
//           {response}
//         </pre>
//       )}
//     </div>
//   );
// };

// export default Metrics;
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { CpuUsage } from './CpuUsage';
import { MemoryUsage } from './MemoryUsage';
import { TotalMemory } from './TotalMemory';
import { Cores } from './Cores';
import { useState } from "react";


export default function Metrics() {
  const [from, setFrom] = useState(''); //2024-7-16T00:00:00Z
  const [to, setTo] = useState(''); //2024-7-16T00:10:00Z
  
  const fromDatePicked = (e: any) => {
    setFrom(e.$y + '-' + (Number(e.$M)+1) + '-' + e.$D + 'T' + e.$H + ':' + e.$m + ':' + '00Z');
  };

  const toDatePicked = (e : any) => {
    setTo(e.$y + '-' + (Number(e.$M)+1) + '-' + e.$D + 'T' + e.$H + ':' + e.$m + ':' + '00Z');
  };

  const getMetrics = ()=>{
    fetch('/metrics',{
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({'filename':(document.getElementById('filename') as HTMLInputElement).value,'project':(document.getElementById('project') as HTMLInputElement).value})
    })
  }

  return (
    <div>
      
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker']}>
        <DateTimePicker label={from} onAccept={(newValue) => fromDatePicked(newValue)} />
      </DemoContainer>
    </LocalizationProvider>

    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DemoContainer components={['DateTimePicker']}>
      <DateTimePicker label={to} onAccept={(newValue) => toDatePicked(newValue)} />
    </DemoContainer>
    </LocalizationProvider>
 
    <CpuUsage from={from} to={to}/>
    <MemoryUsage from={from} to={to}/>
    <TotalMemory from={from} to={from}/>
    <Cores from={from} to={from}/>
  </div>
  );
}