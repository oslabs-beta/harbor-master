import React from "react";
import { CpuUsage } from "./CpuUsage";
import { MemoryUsage } from "./MemoryUsage";
import { TotalMemory } from "./TotalMemory";
import { Cores } from './Cores'
export function App() {
  
  return (
    <>
    <CpuUsage from='2024-07-16T00:00:00Z' to='2024-07-16T00:50:00Z'/>
    <MemoryUsage from='2024-07-16T00:00:00Z' to='2024-07-16T00:50:00Z'/>
    <TotalMemory from='2024-07-16T00:00:00Z' to='2024-07-16T00:10:00Z'/>
    <Cores from='2024-07-16T00:00:00Z' to='2024-07-16T00:10:00Z'/>
    </>
  );
}
