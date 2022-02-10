import { useContext, useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { UserContext } from '../../context';
import { request } from '../../requests';
import { RESPONSIBLE_OFFICER_TYPES, RESPONSIBLE_OFFICER_COPY } from '../../config';
import { isEmpty, emptyInput } from '../../utils'
import Loading from '../loading';
import css from './employee-detail.module.css';

export default function TheftDetail(props) {
    const {requestEmployees} = props

    const { authorization, token } = useContext(UserContext)

    const [ employee, setEmployee ] = useState([])

    const [ dataLoading, setDataLoading ] = useState(false)

    const [dataReceived, setDataReceived] = useState(false)

    const [initialData, setInitialData] = useState([])

    const [loading, setLoading] = useState(false)

    const match = useRouteMatch()

    const {id} = match.params

    const url = `officers/${id}`

    const headers = {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`
    }

    const DataEmployee = (response) => {
        const responseData = response.data
        responseData[RESPONSIBLE_OFFICER_TYPES.PASSWORD] = false
        setEmployee(responseData)
        setInitialData({
            'firstName': response.data[RESPONSIBLE_OFFICER_TYPES.FIRSTNAME],
            'lastName': response.data[RESPONSIBLE_OFFICER_TYPES.LASTNAME],
            'approved': response.data[RESPONSIBLE_OFFICER_TYPES.APPROVED]
        })
    }

    const receivedDataEmployee = (option) => {
        request(option).then (response => {
            DataEmployee(response)
            setDataReceived(true)
            setDataLoading(true)
        }).catch(error => {
            console.log(error.toJSON())
            if (error.toJSON().status === 400) {
                setDataReceived(false)
                setDataLoading(true)
            }
        })
    }

    const dataСhange = (option) => {
        request(option).then (response => {
            DataEmployee(response)
            setLoading(false)
            requestEmployees()
        }).catch(error => {
            console.log(error.toJSON())
            setLoading(false)
        })
    }

    const handleSubmit = e => {
        e.preventDefault()

        const dataToSend = {}

        for (let keyInitialData in initialData) {
            for (let keyEmployee in employee) {
                if (keyInitialData === keyEmployee && initialData[keyInitialData] !== employee[keyEmployee]) {
                    dataToSend[keyInitialData] = employee[keyEmployee]
                }
            }
        }

        const dataToSendIsEmpty = isEmpty(dataToSend)

        if (dataToSendIsEmpty || employee.password) {

            setLoading(true)

            const method = 'put'

            if (dataToSendIsEmpty && employee[RESPONSIBLE_OFFICER_TYPES.PASSWORD]) {

                if (employee[RESPONSIBLE_OFFICER_TYPES.PASSWORD].length >= 3 && employee[RESPONSIBLE_OFFICER_TYPES.PASSWORD].length <= 12) {
        
                    const data = dataToSend

                    data[RESPONSIBLE_OFFICER_TYPES.PASSWORD] = employee[RESPONSIBLE_OFFICER_TYPES.PASSWORD]
            
                    const option = {
                        method: method,
                        url: url,
                        headers: headers,
                        data: data
                    }

                    dataСhange(option)

                } else {
                    alert('Пароль должен быть больше 3 и меньше 12')
                }
            } else if (dataToSendIsEmpty) {
                const data = dataToSend

                const option = {
                    method: method,
                    url: url,
                    headers: headers,
                    data: data
                }

                dataСhange(option)

            } else if (employee.password) {
                if (employee[RESPONSIBLE_OFFICER_TYPES.PASSWORD].length >= 3 && employee[RESPONSIBLE_OFFICER_TYPES.PASSWORD].length <= 12) {
                    const data = {'password': employee[RESPONSIBLE_OFFICER_TYPES.PASSWORD]}
                
                    const option = {
                        method: method,
                        url: url,
                        headers: headers,
                        data: data
                    }

                    dataСhange(option)
                    
                } else {
                    alert('Пароль должен быть больше 3 и меньше 12')
                }
            }
        } else {
            alert('Данные не изменены')
        }
        

    }

    const handleChange = e => {
        const fieldName = e.target.name
        setEmployee({...employee, [fieldName]: e.target.value})
    }

    const handleCheckbox = e => {
        const fieldChecked = e.target.name
        setEmployee({...employee, [fieldChecked]: e.target.checked})
    }

    useEffect (() => {
        const method = 'get'

        const option = {
            method: method,
            url: url,
            headers: headers
        }
        if (authorization && token) {
            receivedDataEmployee(option)
        }
    }, [authorization])

    return (
        <div>
            {dataLoading
                ?   <>
                        {dataReceived
                            ?   <div className={css.data_employee}>
                                    <p className={css.unchanged_data}>{RESPONSIBLE_OFFICER_COPY[RESPONSIBLE_OFFICER_TYPES.CLIENTID]}:<span>{employee[RESPONSIBLE_OFFICER_TYPES.CLIENTID]}</span></p>
                                    <p className={css.unchanged_data}>{RESPONSIBLE_OFFICER_COPY[RESPONSIBLE_OFFICER_TYPES.EMAIL]}:<span>{employee[RESPONSIBLE_OFFICER_TYPES.EMAIL]}</span></p>
                                    <form className={css.editable_data} onSubmit={handleSubmit}>
                                        <label>{RESPONSIBLE_OFFICER_COPY[RESPONSIBLE_OFFICER_TYPES.FIRSTNAME]}:<input onChange={handleChange} name={[RESPONSIBLE_OFFICER_TYPES.FIRSTNAME]} value={emptyInput(employee[RESPONSIBLE_OFFICER_TYPES.FIRSTNAME])} /></label>
                                        <label>{RESPONSIBLE_OFFICER_COPY[RESPONSIBLE_OFFICER_TYPES.LASTNAME]}:<input onChange={handleChange} name={[RESPONSIBLE_OFFICER_TYPES.LASTNAME]} value={emptyInput(employee[RESPONSIBLE_OFFICER_TYPES.LASTNAME])} /></label>
                                        <label>{RESPONSIBLE_OFFICER_COPY[RESPONSIBLE_OFFICER_TYPES.PASSWORD]}:<input onChange={handleChange} name={[RESPONSIBLE_OFFICER_TYPES.PASSWORD]} /></label>
                                        <label className={css.label_checkbox}>{RESPONSIBLE_OFFICER_COPY[RESPONSIBLE_OFFICER_TYPES.APPROVED]}:<input className={css.approved} name={[RESPONSIBLE_OFFICER_TYPES.APPROVED]} onChange={handleCheckbox} type="checkbox" checked={employee[RESPONSIBLE_OFFICER_TYPES.APPROVED]}/><span className={css.fake}></span></label>
                                        <button className={css.submit} type='submit'>Изменить</button>
                                    </form>
                                    {loading && <p className={css.loading}>Загрузка...</p>}
                                </div>
                            :   <h2>Пользователя с id: {id} не существует</h2>
                        }
                    </>
                :   <Loading/>
            }
        </div>
    );
}