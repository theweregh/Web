import request from 'supertest'
import express from 'express'
import ProjectRouter from '../../src/modules/project/router/ProjectRouter'
import ProjectView from '../../src/modules/project/view/ProjectView'
import ProjectModel from '../../src/modules/project/model/ProjectModel'
import ErrorRouter from '../../src/modules/error/router/ErrorRouter'
import ErrorView from '../../src/modules/error/view/ErrorView'
import path from 'path/win32'

// Mock de la DB para pruebas
jest.mock('../../database/projects.json', () => [
  {
    id: 1,
    title: 'Proyecto Test A',
    description: 'Descripción A',
    members: ['Juan', 'Carlos'],
    date: '2025-10-25',
    teacher: 'Profesor A',
    course: 'Curso A',
    project: 'Proyecto A',
    images: ['/img1.jpg', '/img2.jpg'],
    comments: [
      { text: 'Comentario 1', teacher: 'Profesor 1', image: 'prof1.jpg' },
      { text: 'Comentario 2', teacher: 'Profesor 2', image: 'prof2.jpg' },
    ]
  },
  {
    id: 2,
    title: 'Proyecto Test B',
    description: 'Descripción B',
    members: ['Maria', 'Ana'],
    date: '2025-11-01',
    teacher: 'Profesor B',
    course: 'Curso B',
    project: 'Proyecto B',
    images: ['/img3.jpg', '/img4.jpg'],
    comments: [
      { text: 'Comentario 3', teacher: 'Profesor 3', image: 'prof3.jpg' },
      { text: 'Comentario 4', teacher: 'Profesor 4', image: 'prof4.jpg' },
    ]
  }
])

describe('E2E - Project Routes', () => {
  let app: express.Application

  beforeAll(() => {
    const server = express()
    server.use(express.json())
    server.use(express.urlencoded({ extended: true }))
    server.set('view engine', 'ejs')
    server.set('views', path.join(__dirname, '../../src/modules/template'))

    const projectModel = new ProjectModel()
    const projectView = new ProjectView(projectModel)
    const projectRouter = new ProjectRouter(projectView)
    const errorRouter = new ErrorRouter(new ErrorView())

    server.use('/projects', projectRouter.router)
    server.use(errorRouter.router)

    // Log de errores
    server.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error('💥 Error capturado en middleware:', err)
      res.status(500).send('Internal Server Error')
    })

    app = server
  })

  it('GET /projects/home → 200 and contains featured projects', async () => {
    const res = await request(app).get('/projects/home')
    expect(res.status).toBe(200)
    // Comprobamos que la respuesta contenga títulos de proyectos
    expect(res.text).toMatch(/Proyecto Test A/)
    expect(res.text).toMatch(/Proyecto Test B/)
  })

  it('GET /projects/v1.0/list → 200 and contains project list', async () => {
    const res = await request(app).get('/projects/v1.0/list')
    expect(res.status).toBe(200)
    expect(res.text).toMatch(/Proyecto Test A/)
    expect(res.text).toMatch(/Proyecto Test B/)
  })

  it('GET /projects/1 → 200 if exists and contains correct project', async () => {
    const res = await request(app).get('/projects/1')
    expect(res.status).toBe(200)
    expect(res.text).toMatch(/Proyecto Test A/)
    expect(res.text).toMatch(/Descripción A/)
  })

  it('GET /projects/99 → 404 if project does not exist', async () => {
    const res = await request(app).get('/projects/99')
    expect(res.status).toBe(404)
  })

  it('GET /projects/2/gallery → 200 if exists and contains images', async () => {
    const res = await request(app).get('/projects/2/gallery')
    expect(res.status).toBe(200)
    expect(res.text).toMatch(/\/img3\.jpg/)
    expect(res.text).toMatch(/\/img4\.jpg/)
  })
})
