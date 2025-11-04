import ProjectModel from '../src/modules/project/model/ProjectModel'

// Mock para el archivo projects.json
jest.mock('../database/projects.json', () => [
  {
    id: 1,
    title: 'Proyecto A',
    description: 'Descripción del Proyecto A',
    members: ['Juan', 'Carlos'],
    date: '2025-10-25',
    teacher: 'Profesor A',
    course: 'Curso A',
    project: 'El Proyecto A',
    images: ['/img1.jpg', '/img2.jpg'],
    comments: [
      { text: 'Comentario 1', teacher: 'Profesor 1', image: 'prof1.jpg' },
      { text: 'Comentario 2', teacher: 'Profesor 2', image: 'prof2.jpg' },
    ]
  },
  {
    id: 2,
    title: 'Proyecto B',
    description: 'Descripción del Proyecto B',
    members: ['Maria', 'Ana'],
    date: '2025-11-01',
    teacher: 'Profesor B',
    course: 'Curso B',
    project: 'El Proyecto B',
    images: ['/img3.jpg', '/img4.jpg'],
    comments: [
      { text: 'Comentario 3', teacher: 'Profesor 3', image: 'prof3.jpg' },
      { text: 'Comentario 4', teacher: 'Profesor 4', image: 'prof4.jpg' },
    ]
  }
])

describe('ProjectModel', () => {
  let projectModel: ProjectModel

  beforeEach(() => {
    projectModel = new ProjectModel()
  })

  it('should return all projects', () => {
    const projects = projectModel.getAllProjects()
    expect(projects).toHaveLength(2)  // Esperamos que haya 2 proyectos mockeados
    expect(projects[0]?.title).toBe('Proyecto A')
    expect(projects[1]?.title).toBe('Proyecto B')
  })

  it('should return the project with the given ID', () => {
    const project = projectModel.getProjectById(1)
    expect(project).toBeDefined()
    if (project) {
      expect(project.title).toBe('Proyecto A')  // Verificamos que el proyecto devuelto sea el correcto
    }
  })

  it('should return undefined if the project does not exist', () => {
    const project = projectModel.getProjectById(3)  // ID que no existe
    expect(project).toBeUndefined()  // Aseguramos que no exista un proyecto con ID 3
  })

  it('should filter projects based on search query', () => {
    const projects = projectModel.getAllProjects()
    const filteredProjects = projectModel.filterProjects('proyecto a', projects)
    expect(filteredProjects).toHaveLength(1)  // Deberíamos encontrar solo "Proyecto A"
    expect(filteredProjects[0]?.title).toBe('Proyecto A')
  })

  it('should return all projects if no search query is provided', () => {
    const projects = projectModel.getAllProjects()
    const filteredProjects = projectModel.filterProjects('', projects)  // Sin filtro
    expect(filteredProjects).toHaveLength(2)  // Deberíamos encontrar ambos proyectos
  })

  it('should paginate the projects correctly', () => {
    const projects = projectModel.getAllProjects()
    const { paginatedProjects, currentPage, totalPages } = projectModel.paginate(1, projects)  // Página 1
    expect(currentPage).toBe(1)  // Página actual es 1
    expect(totalPages).toBe(1)  // Como tenemos 2 proyectos, solo hay una página
    expect(paginatedProjects).toHaveLength(2)  // La página 1 debería mostrar 2 proyectos
  })

  it('should return featured projects based on courses', () => {
    const featuredProjects = projectModel.getFeaturedProjects()
    expect(featuredProjects).toHaveLength(2)  // Deberíamos obtener dos proyectos
    expect(featuredProjects[0]?.title).toBe('Proyecto A')  // Proyecto A pertenece al curso "Curso A"
    expect(featuredProjects[1]?.title).toBe('Proyecto B')  // Proyecto B pertenece al curso "Curso B"
  })

  it('should return the latest comments from featured projects', () => {
    const featuredProjects = projectModel.getFeaturedProjects()
    const latestComments = projectModel.getLatestComments(featuredProjects)

    expect(latestComments).toHaveLength(4)  // Deberían haber 4 comentarios en total
    expect(latestComments[0]?.text).toBe('Comentario 4')  // Último comentario del proyecto B
    expect(latestComments[3]?.text).toBe('Comentario 1')  // Primer comentario del proyecto A
  })
})