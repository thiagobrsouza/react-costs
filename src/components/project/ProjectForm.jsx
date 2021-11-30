import Input from '../form/Input'
import Select from '../form/Select'
import SubmitButton from '../form/SubmitButton'
import styles from './ProjectForm.module.css'

export default function ProjectForm({btnText}) {
  return (
    <form className={styles.form}>
      <div>
        <Input type="text" text="Nome do Projeto" name="name" placeholder="Insira o nome do projeto"/>
      </div>
      <div>
      <Input type="number" text="Orçamento do Projeto" name="budget" placeholder="Insira o orçamento do Projeto"/>
      </div>
      <div>
        <Select name="category_id" text="Selecione a categoria"/>
      </div>
      <div>
        <SubmitButton text={btnText}/>
      </div>
    </form>
  )
}