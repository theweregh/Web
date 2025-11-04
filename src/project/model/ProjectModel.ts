import projects_json from '../../../database/projects.json'
import Project from '../types/Project'
export default class ProjectModel {
  readonly getAllProjects = (): Project[] => {
    // Si por alguna razón el JSON viene vacío o undefined, devolvemos un array vacío
    return (projects_json || []) as Project[]
  }
  readonly getProjectById = (id: number): Project => {
    const projects = this.getAllProjects()
    return projects.find((p) => p.id === id) as Project
  }
}
