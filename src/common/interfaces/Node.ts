export default interface GcsNode {
  name: string;
  cpuCapacity: string;
  storageCapacity: string;
  memoryCapacity: string;
  cpuAllocated: string;
  storageAllocated: string;
  memoryAllocated: string;
  zone: string;
  region: string;
}
