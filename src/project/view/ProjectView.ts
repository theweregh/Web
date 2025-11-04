import { Request, Response } from 'express'
import ProjectModel from '../model/ProjectModel'

export default class ProjectView {
  constructor(private readonly projectModel: ProjectModel) {}
  /*
  readonly getProjectList = (_req: Request, res: Response) => {
    const projects = this.projectModel.getAllProjects()
    res.status(200).render('projects', { projects })
  }*/
 /*
  readonly getProjectList = (req: Request, res: Response) => {
  const allProjects = this.projectModel.getAllProjects()
  const page = parseInt(req.query["page"] as string) || 1
  const limit = 10
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedProjects = allProjects.slice(start, end)

  const totalPages = Math.ceil(allProjects.length / limit)

  res.status(200).render('projects', {
    projects: paginatedProjects,
    currentPage: page,
    totalPages
  })
}*/
  // 🧩 Método principal que se ejecuta desde la ruta
  readonly getProjectList = (req: Request, res: Response) => {
    const allProjects = this.projectModel.getAllProjects()

    // Buscar (si hay parámetro 'search')
    const filteredProjects = this.filterProjects(req, allProjects)

    // Paginar resultados filtrados
    const { paginatedProjects, currentPage, totalPages } = this.paginate(req, filteredProjects)

    // Renderizar vista
    res.status(200).render('projects', {
      projects: paginatedProjects,
      currentPage,
      totalPages,
      searchQuery: (req.query['search'] as string) || ''
    })
  }

  // 🔍 Método para filtrar proyectos según el parámetro 'search'
  private readonly filterProjects = (req: Request, projects: any[]) => {
    const searchQuery = (req.query['search'] as string || '').trim().toLowerCase()
    if (!searchQuery) return projects // si no hay búsqueda, devuelve todo

    return projects.filter(project => {
      const fieldsToSearch = [
        project.title,
        project.description,
        project.members?.join(' '),
        project.teacher,
        project.course,
        project.project,
        project.date
      ]
      return fieldsToSearch.some(field =>
        field?.toString().toLowerCase().includes(searchQuery)
      )
    })
  }

  // 📄 Método para aplicar la paginación
  private readonly paginate = (req: Request, projects: any[]) => {
    const page = parseInt(req.query['page'] as string) || 1
    const limit = 5
    const start = (page - 1) * limit
    const end = start + limit

    const paginatedProjects = projects.slice(start, end)
    const totalPages = Math.ceil(projects.length / limit) || 1

    return { paginatedProjects, currentPage: page, totalPages }
  }

  readonly getProjectDetails = (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '-1')
    const project = this.projectModel.getProjectById(id)

    if (!project) {
        res.status(404).send('Proyecto no encontrado')
    }

    res.status(200).render('details', { project })
  }
/*
  readonly getProjectHome = (_req: Request, res: Response) => {
  const allProjects = this.projectModel.getAllProjects()

  // Tomar un proyecto por curso (si existen)
  const cursos = [
  'ESTRUCTURAS DE DATOS',
  'INGENIERÍA DE SOFTWARE',
  'INTRODUCCIÓN A INGENIERÍA DE SISTEMAS E INFORMÁTICA',
  'PROYECTO INTEGRADOR I',
  'PROYECTO INTEGRADOR II',
  'PROYECTO INTEGRADOR III',
  'SISTEMAS DISTRIBUIDOS'
];

  const featuredProjects = cursos
    .map(course => allProjects.find(p => p.course.toUpperCase() === course))
    .filter(Boolean) // elimina undefined si no hay alguno

    
  // Obtener todas las declaraciones de los profesores
  const allComments = allProjects.flatMap(p =>
    p.comments.map(c => ({
      ...c,
      projectTitle: p.title
    }))
  )

  // Tomar las últimas 5
  const latestComments = allComments.slice(-5).reverse()

  res.status(200).render('home', { featuredProjects, latestComments })
}*/
readonly getProjectHome = (_req: Request, res: Response) => {
  const allProjects = this.projectModel.getAllProjects()

  // Tomar un proyecto por curso (si existen)
  const cursos = [
  'INTRODUCCIÓN A INGENIERÍA DE SISTEMAS E INFORMÁTICA',
  'ESTRUCTURAS DE DATOS',
  'INGENIERÍA DE SOFTWARE',
  'PROYECTO INTEGRADOR I',
  'PROYECTO INTEGRADOR II',
  'PROYECTO INTEGRADOR III',
  'SISTEMAS DISTRIBUIDOS'
];

  const featuredProjects = cursos
    .map(course => allProjects.find(p => p.course.toUpperCase() === course))
    .filter((p): p is NonNullable<typeof p> => Boolean(p)) // elimina undefined si no hay alguno

    
  // Obtener todas las declaraciones de los profesores
  const allComments = featuredProjects.flatMap(p =>
    p.comments.map(c => ({
      ...c,
      projectTitle: p.title
    }))
  )

  // Tomar las últimas 5
  const latestComments = allComments.slice(-5).reverse()

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
