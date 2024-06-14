import { ResourceType } from "types/ResourceType";

export default interface Vertex {
  id: string
  resourceType: ResourceType
  position: [number, number]
  // data will be filled in as we go
  data: object
}