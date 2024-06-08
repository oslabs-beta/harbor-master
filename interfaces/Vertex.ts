import { ResourceType } from "types/ResourceType";
import VertexData from 'interfaces/VertexData';

export default interface Vertex {
  id: string
  resourceType: ResourceType
  position: [number, number]
  // VertexData interface is not fully defined yet but will be as we go
  data: VertexData
}