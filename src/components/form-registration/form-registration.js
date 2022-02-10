import { useState, useContext } from 'react';
import { request } from '../../requests';
import { LoadingContext } from '../../context';
import { RESPONSIBLE_OFFICER_TYPES, RESPONSIBLE_OFFICER_COPY } from '../../config';
import css from './form-registration.module.css';

export default function FormRegistration(props) {
    const { requestSignIn } = props
    const { setImgLoading } = useContext(LoadingContext)

    const [values, setValues] = useState({
        [RESPONSIBLE_OFFICER_TYPES.EMAIL]: '',
        [RESPONSIBLE_OFFICER_TYPES.PASSWORD]: '',
        [RESPONSIBLE_OFFICER_TYPES.FIRSTNAME]: '',
        [RESPONSIBLE_OFFICER_TYPES.LASTNAME]: '',
        [RESPONSIBLE_OFFICER_TYPES.CLIENTID]: ''
    })

    const handleChange = (e) => {
        const fieldName = e.target.name
        setValues({...values, [fieldName]: e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (values[RESPONSIBLE_OFFICER_TYPES.EMAIL] && values[RESPONSIBLE_OFFICER_TYPES.PASSWORD] && values[RESPONSIBLE_OFFICER_TYPES.CLIENTID]) {
            setImgLoading(true)

            const method = 'post'
  
            const url = `auth/sign_up`

            const headers = {
                'Content-type': 'application/json'
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

            request(option).then (() => {
                requestSignIn(values)
            }).catch(error => {
                console.log(error.response)
                setImgLoading(false)
                alert(error.response.data.message)
            })
        } else {
            alert(`Не введены ${RESPONSIBLE_OFFICER_COPY[RESPONSIBLE_OFFICER_TYPES.EMAIL]}, ${RESPONSIBLE_OFFICER_COPY[RESPONSIBLE_OFFICER_TYPES.PASSWORD]}, ${RESPONSIBLE_OFFICER_COPY[RESPONSIBLE_OFFICER_TYPES.CLIENTID]}`)
        }
    }

    return (
        <div className={css.form_sign}>
            <p>Регистрация</p>
            <form onSubmit={handleSubmit}>
                <label>{RESPONSIBLE_OFFICER_COPY[RESPONSIBLE_OFFICER_TYPES.EMAIL]}<input value={values[RESPONSIBLE_OFFICER_TYPES.EMAIL]} name={RESPONSIBLE_OFFICER_TYPES.EMAIL} onChange={handleChange}/></label>
                <label>{RESPONSIBLE_OFFICER_COPY[RESPONSIBLE_OFFICER_TYPES.PASSWORD]}<input value={values[RESPONSIBLE_OFFICER_TYPES.PASSWORD]} name={RESPONSIBLE_OFFICER_TYPES.PASSWORD} onChange={handleChange}/></label>
                <label>{RESPONSIBLE_OFFICER_COPY[RESPONSIBLE_OFFICER_TYPES.FIRSTNAME]}<input value={values[RESPONSIBLE_OFFICER_TYPES.FIRSTNAME]} name={RESPONSIBLE_OFFICER_TYPES.FIRSTNAME} onChange={handleChange}/></label>
                <label>{RESPONSIBLE_OFFICER_COPY[RESPONSIBLE_OFFICER_TYPES.LASTNAME]}<input value={values[RESPONSIBLE_OFFICER_TYPES.LASTNAME]} name={RESPONSIBLE_OFFICER_TYPES.LASTNAME} onChange={handleChange}/></label>
                <label>{RESPONSIBLE_OFFICER_COPY[RESPONSIBLE_OFFICER_TYPES.CLIENTID]}<input value={values[RESPONSIBLE_OFFICER_TYPES.CLIENTID]} name={RESPONSIBLE_OFFICER_TYPES.CLIENTID} onChange={handleChange}/></label>
                <button type='submit'>Зарегистрироваться</button>
            </form>
        </div>
    );
}