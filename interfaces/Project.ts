import Vertex from "interfaces/Vertex";
import Edge from "interfaces/Edge";

export default interface Project {
  id: string
  userId: string
  googleCloudId: string
  createdAt: string
  googleRegion: string
  vertices: Vertex[]
  edges: Edge[]
}