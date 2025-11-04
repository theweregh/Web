import { Router } from 'express'
import ProjectView from '../view/ProjectView'

export default class ProjectRouter {
  router: Router

  constructor(private readonly projectView: ProjectView) {
    this.router = Router()
    this.routes()
  }

  readonly routes = () => {
    this.router.get('/home', this.projectView.getProjectHome)
    this.router.get('/v1.0/list', this.projectView.getProjectList)
    this.router.get('/:id', this.projectView.getProjectDetails)
    this.router.get('/:id/gallery', this.projectView.getProjectGallery)

  }
}
