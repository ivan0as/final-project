import { useState, useContext } from 'react';
import { RESPONSIBLE_OFFICER_TYPES, RESPONSIBLE_OFFICER_COPY } from '../../config';
import { LoadingContext } from '../../context';
import css from './form-authorization.module.css';

export default function FormAuthorization(props) {
    const {requestSignIn} = props

    const {setImgLoading, setBadВataMessage} = useContext(LoadingContext)

    const [values, setValues] = useState({
        [RESPONSIBLE_OFFICER_TYPES.EMAIL]: '',
        [RESPONSIBLE_OFFICER_TYPES.PASSWORD]: ''
    })

    
    const handleChange = (e) => {
        const fieldName = e.target.name
        setValues({...values, [fieldName]: e.target.value})
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!values[RESPONSIBLE_OFFICER_TYPES.EMAIL] && !values[RESPONSIBLE_OFFICER_TYPES.PASSWORD]) {
            alert ('Заполните E-mail и Пароль')
        } else if (!values[RESPONSIBLE_OFFICER_TYPES.EMAIL]) {
            alert ('Заполните E-mail')
        } else if (!values[RESPONSIBLE_OFFICER_TYPES.PASSWORD]){
            alert ('Заполните Пароль')
        } else {
            setBadВataMessage(false)

            requestSignIn(values)

            setImgLoading(true)
        }
    }

    return (
        <div className={css.form_sign}>
            <p>Авторизация</p>
            <form onSubmit={handleSubmit}>
                <label>{RESPONSIBLE_OFFICER_COPY[RESPONSIBLE_OFFICER_TYPES.EMAIL]}<input id='signUpMail' name={[RESPONSIBLE_OFFICER_TYPES.EMAIL]} type='text' value={values[RESPONSIBLE_OFFICER_TYPES.EMAIL]} onChange={handleChange}/></label>
                <label>{RESPONSIBLE_OFFICER_COPY[RESPONSIBLE_OFFICER_TYPES.PASSWORD]}<input id='signUpPassword' name={[RESPONSIBLE_OFFICER_TYPES.PASSWORD]} type='text' value={values[RESPONSIBLE_OFFICER_TYPES.PASSWORD]} onChange={handleChange}/></label>
                <button type='submit'>Войти</button>
            </form>
        </div>
    );
}