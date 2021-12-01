import Message from "../layout/Message";
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Container from '../layout/Container'
import LinkButton from '../layout/LinkButton'
import styles from './styles/Projects.module.css'
import ProjectCard from "../project/ProjectCard";
import Loading from "../layout/Loading";

export default function Projects() {

  const [projects, setProjects] = useState([])
  const [removeLoading, setRemoveLoading] = useState(false)

  const location = useLocation()
  let message = ''
  if (location.state) {
    message = location.state.message
  }

  useEffect(() => {
    setTimeout(() => {
      fetch('http://localhost:5000/projects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data)
      setProjects(data)
      setRemoveLoading(true)
    })
    .catch((err) => console.log(err))
    }, 300)
  }, [])

  return (
    <div className={styles.project_container}>
      <div className={styles.title_container}>
        <h1>Meus Projetos</h1>
        <LinkButton to="/newproject" text="Criar Projeto" />
      </div>
      {message && <Message msg={message} type="success" />}
      <Container customClass="start">
        {projects.length > 0 &&
          projects.map((project) => (
            <ProjectCard name={project.name} id={project.id} budget={project.budget} category={project.category.name}
            key={project.id}/>
          ))}
          {!removeLoading && <Loading />}
          {removeLoading && projects.length === 0 && (
            <p>Não há projetos para serem exibidos</p>
          )}
      </Container>
    </div>
  )
}