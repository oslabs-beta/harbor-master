import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { CpuUsage } from './CpuUsage';
import { MemoryUsage } from './MemoryUsage';
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
  </div>
  );
}
