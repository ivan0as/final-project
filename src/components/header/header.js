import { useState, useContext, useEffect } from 'react';
import { request } from '../../requests';
import { COMPANY } from '../../config';
import { UserContext, LoadingContext } from '../../context';
import { RESPONSIBLE_OFFICER_TYPES } from '../../config';
import PopupSign from '../popup-sign';
import FormRegistration from '../form-registration';
import FormAuthorization from '../form-authorization';
import css from './header.module.css';
import css_app from '../app/app.module.css';

export default function Header() {

    const [isFormVisible, setFormVisible ] = useState(false)

    const [signInSwitch, setSignInSwitch] = useState(false)

    const [signUpSwitch, setSignUpSwitch ] = useState(false)

    const [imgLoading, setImgLoading] = useState(false)

    const [badВataMessage, setBadВataMessage] = useState(false)

    const {user, setUser, authorization, setAuthorization, setToken} = useContext(UserContext)

    useEffect(() => {
        if (user.status === 'OK') {
            setAuthorization(true)
            setFormVisible(false)
        } else {
            setAuthorization(false)
        }
    }, [user, setAuthorization])

    const signIn = () => {
        if (signUpSwitch && isFormVisible) {
            setSignUpSwitch(!signUpSwitch)
            setSignInSwitch(!signInSwitch)
        } else if (!isFormVisible) {
            setSignInSwitch(!signInSwitch)
            switchVisible()
        }
        
    }

    const signUp = () => {
        if (signInSwitch && isFormVisible) {
            setSignInSwitch(!signInSwitch)
            setSignUpSwitch(!signUpSwitch)
        } else if (!isFormVisible) {
            setSignUpSwitch(!signUpSwitch)
            switchVisible()
        }
    }

    const close = () => {
        setSignInSwitch(false)
        setSignUpSwitch(false)
        switchVisible()
    }

    const switchVisible = () => {
        setFormVisible(!isFormVisible)
    }

    const exit = () => {
        let dataUser = {
            "status": false,
            "data": {
                "token": false,
                "user": {
                    "id": false,
                    [RESPONSIBLE_OFFICER_TYPES.EMAIL]: false,
                    [RESPONSIBLE_OFFICER_TYPES.FIRSTNAME]: false,
                    [RESPONSIBLE_OFFICER_TYPES.LASTNAME]: false,
                    [RESPONSIBLE_OFFICER_TYPES.APPROVED]: false
                }
            }
        }
        setUser(dataUser)
        localStorage.removeItem('token')
        setToken(false)
        setSignInSwitch(false)
        setSignUpSwitch(false)
    }

    const requestSignIn = (values) => {
        const method = 'post'
        
        const url = 'auth/sign_in'

        const data = {
            [RESPONSIBLE_OFFICER_TYPES.EMAIL]: values[RESPONSIBLE_OFFICER_TYPES.EMAIL],
            [RESPONSIBLE_OFFICER_TYPES.PASSWORD]: values[RESPONSIBLE_OFFICER_TYPES.PASSWORD]
        }
        const headers = {
            'Content-type': 'application/json',
        }
        
        const option = {
            method: method,
            url: url,
            headers: headers,
            data: data
        }

        request(option).then (responseData => {
            setUser(responseData)
            setToken(responseData.data.token)
            setImgLoading(false)
            setBadВataMessage(false)
        }).catch(error => {
            if (error.toJSON().status === 400) {
                setBadВataMessage(true)
            } else {
                alert(`Код ошибки ${error.toJSON().status}`)
            }
            setImgLoading(false)
        })
    }

    return (
        <header className={css.header}>
            <div className={css_app.container}>
                <div className={css.header_content}>
                    <h1 className={css.h1}>{COMPANY}</h1>
                    {authorization
                    ?   <div className={css.user_menu}>
                            <span className={css.email}>{user.data.user[RESPONSIBLE_OFFICER_TYPES.EMAIL]}</span>
                            <span className={css.slash}>/</span>
                            <button onClick={exit}>Выйти</button>
                        </div>   
                    :   <div className={css.user_menu}>
                            <button onClick={signIn}>Вход</button>
                            <span>/</span>
                            <button onClick={signUp}>Регистрация</button>
                        </div>
                    }
                </div>
                {isFormVisible && !authorization &&(
                    <LoadingContext.Provider value={{imgLoading, setImgLoading, badВataMessage, setBadВataMessage}}>
                        <PopupSign close={close}>
                            {signInSwitch && (
                                <FormAuthorization requestSignIn={requestSignIn}/>
                            )}
                            {signUpSwitch && (
                                <FormRegistration requestSignIn={requestSignIn}/>
                            )}
                        </PopupSign>
                    </LoadingContext.Provider>
                )}
            </div>
        </header>
    );
}