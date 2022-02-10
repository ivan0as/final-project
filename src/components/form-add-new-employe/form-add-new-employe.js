import { useState, useContext } from 'react';
import { UserContext } from '../../context';
import { request } from '../../requests';
import { RESPONSIBLE_OFFICER_TYPES, RESPONSIBLE_OFFICER_COPY } from '../../config';
import css from './form-add-new-employe.module.css';

export default function FormAddNewEmploye(props) {
    const { employees, setEmployees } = props

    const { token } = useContext(UserContext)

    const [values, setValues] = useState({
        [RESPONSIBLE_OFFICER_TYPES.EMAIL]: '',
        [RESPONSIBLE_OFFICER_TYPES.PASSWORD]: '',
        [RESPONSIBLE_OFFICER_TYPES.FIRSTNAME]: '',
        [RESPONSIBLE_OFFICER_TYPES.LASTNAME]: '',
        [RESPONSIBLE_OFFICER_TYPES.APPROVED]: false
    })

    const handleChange = (e) => {
        const fieldName = e.target.name
        setValues({...values, [fieldName]: e.target.value})
    }

    const handleCheckbox = e => {
        const fieldChecked = e.target.name
        setValues({...values, [fieldChecked]: e.target.checked})
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (values[RESPONSIBLE_OFFICER_TYPES.EMAIL] && values[RESPONSIBLE_OFFICER_TYPES.PASSWORD]) {
            const method = 'post'
    
            const url = `officers`
    
            const headers = {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
    
            const data = {}
    
            for (let key in values) {
                if (values[key]) {
                    data[key] = values[key]
                }
            }
    
            const option = {
                method: method,
                url: url,
                headers: headers,
                data: data
            }
    
            request(option).then (response => {
                console.log(response.data)
                console.log(employees)
                setEmployees([...employees, response.data])
            }).catch(error => {
                console.log(error.response)
                alert(error.response.data.message)
            })
        } else {
            alert('Обязательные поля для заполнения: E-mail и Пароль')
        }

    }

    return (
        <div className={css.add_new_employee}>
            <p>Добавить сотрудника</p>
            <form className={css.form_add_new_employee} onSubmit={handleSubmit}>
                <label>{RESPONSIBLE_OFFICER_COPY[RESPONSIBLE_OFFICER_TYPES.EMAIL]}<input value={values[RESPONSIBLE_OFFICER_TYPES.EMAIL]} name={[RESPONSIBLE_OFFICER_TYPES.EMAIL]} onChange={handleChange}/></label>
                <label>{RESPONSIBLE_OFFICER_COPY[RESPONSIBLE_OFFICER_TYPES.PASSWORD]}<input value={values[RESPONSIBLE_OFFICER_TYPES.PASSWORD]} name={[RESPONSIBLE_OFFICER_TYPES.PASSWORD]} onChange={handleChange}/></label>
                <label>{RESPONSIBLE_OFFICER_COPY[RESPONSIBLE_OFFICER_TYPES.FIRSTNAME]}<input value={values[RESPONSIBLE_OFFICER_TYPES.FIRSTNAME]} name={[RESPONSIBLE_OFFICER_TYPES.FIRSTNAME]} onChange={handleChange}/></label>
                <label>{RESPONSIBLE_OFFICER_COPY[RESPONSIBLE_OFFICER_TYPES.LASTNAME]}<input value={values[RESPONSIBLE_OFFICER_TYPES.LASTNAME]} name={[RESPONSIBLE_OFFICER_TYPES.LASTNAME]} onChange={handleChange}/></label>
                <label className={css.label_checkbox}>{RESPONSIBLE_OFFICER_COPY[RESPONSIBLE_OFFICER_TYPES.APPROVED]}<input className={css.approved} type="checkbox" checked={values[RESPONSIBLE_OFFICER_TYPES.APPROVED]} name={[RESPONSIBLE_OFFICER_TYPES.APPROVED]} onChange={handleCheckbox}/><span className={css.fake}></span></label>
                <button className={css.btn_add} type='submit'>Добавить</button>
            </form>
        </div>
    );
}