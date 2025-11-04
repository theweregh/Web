import express, { Application } from 'express'
import path from 'node:path'
import ErrorRouter from './error/router/ErrorRouter'
import ErrorView from './error/view/ErrorView'
import ProjectRouter from './project/router/ProjectRouter'
import ProjectModel from './project/model/ProjectModel'
import ProjectView from './project/view/ProjectView'
import favicon from 'serve-favicon'
export default class Server {
  private readonly app: Application

  constructor(
    private readonly errorRouter: ErrorRouter,
    private readonly projectRouter: ProjectRouter
  ) {
    this.app = express()
    this.configure()
    this.static()
    this.routes()
  }

  private readonly configure = (): void => {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.set('view engine', 'ejs')
    this.app.set('views', path.join(__dirname, './template'))
  }

  private readonly routes = (): void => {
    this.app.use('/projects', this.projectRouter.router)
    this.app.use('/{*any}', this.errorRouter.router)
  }

  private readonly static = (): void => {
    this.app.use(express.static(path.join(__dirname, './public')))
    this.app.use(favicon(path.join(__dirname, './public', 'UN.png')))
    this.app.use('/assets', express.static(path.join(__dirname, '../../assets')))
    
  }

  readonly start = (): void => {
    const port = 1888
    const host = 'localhost'
    this.app.listen(port, () => {
      console.log(`Server is running on http://${host}:${port}`)
    })
  }
}

const server = new Server(
  new ErrorRouter(new ErrorView()),
  new ProjectRouter(new ProjectView(new ProjectModel()))
)
server.start()
