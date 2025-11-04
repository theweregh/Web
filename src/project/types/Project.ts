export interface Comment {
  text: string        // el comentario
  teacher: string     // nombre del profesor
  image: string       // nombre o ruta de la imagen
}

export default interface Project {
  id: number
  title: string
  description: string
  members: string[]
  date: string
  teacher: string
  course: string
  project: string
  images: string[]
  comments: Comment[] // lista de comentarios con estructura clara
}