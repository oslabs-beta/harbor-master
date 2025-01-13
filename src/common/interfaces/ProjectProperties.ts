import Vertex from "interfaces/Vertex";
import Edge from "interfaces/Edge";
import UserDeploymentOptions from "./UserDeploymentOptions";
import DeploymentProperties from "./DeploymentProperties";

export default interface ProjectProperties extends DeploymentProperties {
  id: string
  userId: string
  deploymentOptions: UserDeploymentOptions;
  createdAt: string
  vertices: Vertex[]
  edges: Edge[]
  isDeployed: Boolean
}