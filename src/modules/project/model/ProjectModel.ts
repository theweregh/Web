import projects_json from '../../../../database/projects.json'
import Project from '../types/Project'

export default class ProjectModel {
  readonly getAllProjects = (): Project[] => {
    // Si por alguna razón el JSON viene vacío o undefined, devolvemos un array vacío
    return (projects_json || []) as Project[] // Aquí, projects_json siempre debería ser un array de Projects
  }

  readonly getProjectById = (id: number): Project | undefined => {
    const projects = this.getAllProjects()
    return projects.find((p) => p.id === id) // Retorna undefined si no se encuentra
  }

  // 🔍 Método para filtrar proyectos según el parámetro 'search'
  readonly filterProjects = (searchQuery: string, projects: Project[]): Project[] => {
    searchQuery = (searchQuery || '').trim().toLowerCase()
    if (!searchQuery) return projects // si no hay búsqueda, devuelve todos los proyectos

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
      // Usamos `String(field)` en lugar de `field?.toString()` para garantizar que el valor no sea null o undefined
      return fieldsToSearch.some(field =>
        String(field).toLowerCase().includes(searchQuery)
      )
    })
  }

  // 📄 Método para aplicar la paginación
  readonly paginate = (page: number, projects: Project[]): { paginatedProjects: Project[], currentPage: number, totalPages: number } => {
    const limit = 5
    const start = (page - 1) * limit
    const end = start + limit

    const paginatedProjects = projects.slice(start, end)
    const totalPages = Math.ceil(projects.length / limit) || 1

    return { paginatedProjects, currentPage: page, totalPages }
  }

  // 🧩 Obtener proyectos destacados por curso
  readonly getFeaturedProjects = (): Project[] => {
  const allProjects = this.getAllProjects()

  // Obtener lista de cursos únicos de los proyectos existentes
  const cursosUnicos = Array.from(new Set(allProjects.map(p => p.course.toUpperCase())))

  // Por cada curso, tomar un proyecto cualquiera
  return cursosUnicos
    .map(curso => allProjects.find(p => p.course.toUpperCase() === curso))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)
}


  // Obtener los últimos comentarios
  readonly getLatestComments = (featuredProjects: Project[]): { text: string, teacher: string, image: string, projectTitle: string }[] => {
    return featuredProjects.flatMap(p =>
      p.comments.map(c => ({
        ...c,
        projectTitle: p.title
      }))
    ).slice(-5).reverse()
  }
}