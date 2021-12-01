import { parse, v4 as uuidv4 } from 'uuid'

import styles from './styles/Project.module.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Loading from '../layout/Loading'
import Container from '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import Message from '../layout/Message'
import ServiceForm from '../service/ServiceForm'

export default function Project() {

  let {id} = useParams()
  const [project, setProject] = useState([])
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [message, setMessage] = useState()
  const [type, setType] = useState()

  useEffect(() => {
    fetch(`http://localhost:5000/projects/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json())
    .then((data) => {
      setProject(data)
    })
    .catch(err => console.log(err))
  }, [id])

  function editPost(project) {
    setMessage('')
    if(project.budget < project.cost) {
      setMessage('O orçamento não pode ser menor que o custo do projeto')
      setType('error')
      return false
    }
    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(project),
    })
    .then((resp) => resp.json())
    .then((data) => {
      setProject(data)
      setShowProjectForm(false)
      setMessage('Projeto atualizado com sucesso!')
      setType('success')
    })
    .catch(err => console.error(err))
  }

  function createService(project) {
    setMessage('')
    const lastService = project.services[project.services.length - 1]
    lastService.id = uuidv4()
    const lastServiceCost = lastService.cost
    const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

    // validacao de exceder valor
    if(newCost > parseFloat(project.budget)) {
      setMessage('Orçamento ultrapassado, verifique o valor do serviço.')
      setType('error')
      project.services.pop()
      return false
    }

    // adiciona o custo do servico ao valor total do projeto
    project.cost = newCost

    // atualizar o projeto
    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(project)
    })
    .then((resp) => resp.json())
    .then((data) => {
      // exibir servicos
      console.log(data)
    })
    .catch(err => console.log(err))

  }

  function toggleProjectForm() {
    setShowProjectForm(!showProjectForm)
  }

  function toggleServiceForm() {
    setShowServiceForm(!showServiceForm)
  }

  return (
    <>{ project.name ? 
      <div className={styles.project_details}>
        <Container customClass="column">
          {message && <Message type={type} msg={message}/>}
          <div className={styles.details_container}>
            <h1>Projeto: {project.name}</h1>
            <button onClick={toggleProjectForm} className={styles.btn}>
              {!showProjectForm ? 'Editar Projeto' : 'Fechar'}
            </button>
            {!showProjectForm ? (
              <div className={styles.project_info}>
                <p>
                  <span>Categoria:</span> {project.category.name}
                </p>
                <p>
                  <span>Total de Orçamento:</span> R$ {project.budget}
                </p>
                <p>
                  <span>Total Utilizado:</span> R$ {project.cost}
                </p>
              </div>
            ) : (
              <div className={styles.project_info}>
                <ProjectForm handleSubmit={editPost} btnText="Concluir edição" projectData={project}/>
              </div>
            )}
          </div>
          <div className={styles.service_form_container}>
              <h2>Adicione um serviço:</h2>
              <button onClick={toggleServiceForm} className={styles.btn}>
                {!showServiceForm ? 'Adicionar Serviço' : 'Fechar'}
              </button>
              <div className={styles.project_info}>
                {showServiceForm && (
                  <ServiceForm handleSubmit={createService} btnText="Adicionar Serviço" projectData={project}/>
                )}
              </div>
          </div>
          <h2>Serviços</h2>
          <Container customClass="start">
            <p>Itens do serviço</p>
          </Container>
        </Container>
      </div>
    : <Loading /> }
    </>
  )
}