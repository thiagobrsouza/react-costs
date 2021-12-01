import styles from './styles/Project.module.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Loading from '../layout/Loading'
import Container from '../layout/Container'

export default function Project() {

  const {id} = useParams()
  const [project, setProject] = useState([])
  const [showProjectForm, setShowProjectForm] = useState(false)

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

  function toggleProjectForm() {
    setShowProjectForm(!showProjectForm)
  }

  return (
    <>{ project.name ? 
      <div className={styles.project_details}>
        <Container customClass="column">
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
                <p>Detalhes do Projeto</p>
              </div>
            )}
          </div>
        </Container>
      </div>
    : <Loading /> }
    </>
  )
}