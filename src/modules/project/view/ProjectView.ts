import { Request, Response } from 'express'
import ProjectModel from '../model/ProjectModel'

export default class ProjectView {
  constructor(private readonly projectModel: ProjectModel) {}

  // 🧩 Método principal que se ejecuta desde la ruta
  readonly getProjectList = (req: Request, res: Response) => {
    const allProjects = this.projectModel.getAllProjects()

    // Buscar (si hay parámetro 'search')
    const searchQuery = (req.query['search'] as string) || ''
    const filteredProjects = this.projectModel.filterProjects(searchQuery, allProjects)

    // Paginar resultados filtrados
    const { paginatedProjects, currentPage, totalPages } = this.projectModel.paginate(parseInt(req.query['page'] as string) || 1, filteredProjects)

    // Renderizar vista
    res.status(200).render('projects', {
      projects: paginatedProjects,
      currentPage,
      totalPages,
      searchQuery
    })
  }

  readonly getProjectDetails = (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '-1')
    const project = this.projectModel.getProjectById(id)

    if (!project) {
      res.status(404).send('Proyecto no encontrado')
      return
    }

    res.status(200).render('details', { project })
  }

  readonly getProjectHome = (_req: Request, res: Response) => {
  const featuredProjects = this.projectModel.getFeaturedProjects()
  const latestComments = this.projectModel.getLatestComments(featuredProjects)

  res.status(200).render('home', { featuredProjects, latestComments })
}


  readonly getProjectGallery = (req: Request, res: Response): void => {
    const id = parseInt(req.params['id'] || '-1')
    const project = this.projectModel.getProjectById(id)

    if (!project) {
      res.status(404).send('Proyecto no encontrado')
      return
    }

    // Renderiza la galería EJS con las imágenes del proyecto
    res.status(200).render('gallery', { project })
  }
}
