import puppeteer, { Browser, Page } from 'puppeteer'
import Server from '../../src/modules/index'
import ErrorRouter from '../../src/modules/error/router/ErrorRouter'
import ErrorView from '../../src/modules/error/view/ErrorView'
import ProjectRouter from '../../src/modules/project/router/ProjectRouter'
import ProjectView from '../../src/modules/project/view/ProjectView'
import ProjectModel from '../../src/modules/project/model/ProjectModel'

let browser: Browser
let page: Page
let serverInstance: any
const PORT = 1888

beforeAll(async () => {
  const server = new Server(
    new ErrorRouter(new ErrorView()),
    new ProjectRouter(new ProjectView(new ProjectModel()))
  )
  serverInstance = server['app'].listen(PORT, () => {
    console.log(`🟢 Test server running on http://localhost:${PORT}`)
  })

  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  page = await browser.newPage()
})

afterAll(async () => {
  await browser.close()
  await new Promise(resolve => serverInstance.close(resolve))
})

describe('E2E - Project UI routes with Puppeteer', () => {
  it('should render the home page correctly', async () => {
    await page.goto(`http://localhost:${PORT}/projects/home`)
    const title = await page.title()
    expect(title).toMatch(/Inicio|Proyectos Integradores/i)
  })

  it('should show a list of projects', async () => {
    await page.goto(`http://localhost:${PORT}/projects/v1.0/list`)
    const content = await page.content()
    expect(content).toMatch(/Project|Proyecto/i)
  })

  it('should display project details if it exists', async () => {
    await page.goto(`http://localhost:${PORT}/projects/1`)
    const html = await page.content()
    expect(html).toMatch(/Proyecto|Project/i)
  })

  it('should show gallery with images for project 2', async () => {
    await page.goto(`http://localhost:${PORT}/projects/2/gallery`)
    const images = await page.$$eval('img', (imgs: HTMLImageElement[]) =>
      imgs.map(img => img.src)
    )
    expect(images.length).toBeGreaterThan(0)
  })

  it('should display 404 error page for non-existing project', async () => {
    await page.goto(`http://localhost:${PORT}/projects/999`, { waitUntil: 'domcontentloaded' })
    const html = await page.content()
    expect(html).toMatch(/404|Not Found|Proyecto no encontrado/i)
  })
})
