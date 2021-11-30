import ProjectForm from '../project/ProjectForm'
import styles from './styles/NewProject.module.css'
import { useHistory } from 'react-router-dom'

export default function NewProject() {

  const history = useHistory()

  function createPost(project) {
    // inicia cost and services
    project.cost = 0
    project.services = []

    fetch('http://localhost:5000/projects', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    })
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data)
      //redirect
      history.push('/projects', {message: 'Projeto criado com sucesso!'})
    })
    .catch(err => console.log(err));
  }

  return (
    <div className={styles.newproject_container}>
      <h1>Criar Projeto</h1>
      <p>Crie seu projeto para depois adicionar os serviços</p>
      <ProjectForm handleSubmit={createPost} btnText="Criar Projeto"/>
    </div>
  )
}