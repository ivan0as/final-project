import { useContext, useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { UserContext } from '../../context';
import { request } from '../../requests';
import { RESPONSIBLE_OFFICER_TYPES, THEFT_REPORT_TYPES, THEFT_REPORT_COPY, BIKE_TYPE, MESSAGE_STATUS } from '../../config';
import { formatDate, isEmpty, emptyInput } from '../../utils'
import Loading from '../loading';
import css from './theft-detail.module.css';

export default function TheftDetail(props) {
    const {requestThefts} = props

    const { authorization, token } = useContext(UserContext)

    const [ theft, setTheft ] = useState([])

    const [initialData, setInitialData] = useState([])

    const [dataBeforeFormatting, setDataBeforeFormatting] = useState(false)

    const [employees, setEmployees] = useState({})

    const [dataLoading, setDataLoading] = useState(false)

    const [dataReceived, setDataReceived] = useState(false)

    const [loading, setLoading] = useState(false)

    const [invisibleResolution, setInvisibleResolution] = useState(false)

    const match = useRouteMatch()

    const {id} = match.params

    const handleChange = e => {
        const fieldName = e.target.name
        setTheft({...theft, [fieldName]: e.target.value})
    }

    const changeFormData = (response) => {
        const dateArray = {
            createdAt: [THEFT_REPORT_TYPES.CREATEDAT],
            updatedAt: [THEFT_REPORT_TYPES.UPDATEDAT],
            date: [THEFT_REPORT_TYPES.DATE]
        }

        const dataDates= []

        for (let key in dateArray) {
            if (response[dateArray[key]]) {
                dataDates[dateArray[key]] = formatDate(response[dateArray[key]])
            }
        }

        return dataDates
        
    }

    const sendingData = (option) => {
        setLoading(true)
        request(option).then (response => {
            const arrayTheft = response.data
            const dataDates = changeFormData(arrayTheft)
            for (let keyTheft in arrayTheft) {
                for (let keyDates in dataDates) {
                    if (keyTheft === keyDates) {
                        arrayTheft[keyTheft] = dataDates[keyDates]
                    }
                }
            }
            setTheft({...theft, ...arrayTheft})
            setInitialData({...theft, ...arrayTheft})
            requestThefts()
            setLoading(false)
        }).catch(error => {
            setLoading(false)
            console.log(error)
        })
    }

    const handleSubmit = e => {
        e.preventDefault()

        const dataToSend = {}

        for (let keyInitialData in initialData) {
            for (let keyTheft in theft) {
                if (keyInitialData === keyTheft && initialData[keyInitialData] !== theft[keyTheft]) {
                    dataToSend[keyInitialData] = theft[keyTheft]
                }
            }
        }

        const dataToSendIsEmpty = isEmpty(dataToSend)

        const method = 'put'
  
        const url = `cases/${id}`

        const headers = {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        }

        const data = dataToSend

        const option = {
            method: method,
            url: url,
            headers: headers,
            data: data
        }

        if (dataToSendIsEmpty) {
            if (theft[THEFT_REPORT_TYPES.STATUS] !== MESSAGE_STATUS.DONE) {
                sendingData(option)
            } else {
                if (theft[THEFT_REPORT_TYPES.RESOLUTION]) {
                    sendingData(option)
                } else {
                    alert(`Введите ${THEFT_REPORT_COPY[THEFT_REPORT_TYPES.RESOLUTION]}`)
                }
            }
        } else {
            alert('Данные не изменены')
        }
    }
    
    useEffect (() => {
        const method = 'get'
  
        const url = `cases/${id}`

        const headers = {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        }

        const option = {
            method: method,
            url: url,
            headers: headers
        }

        if (authorization && token) {
            request(option).then (response => {
                setTheft(response.data)

                setDataBeforeFormatting(true)

                const methodEmployees = 'get'
          
                const urlEmployees = 'officers/'
            
                const headersEmployees = {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            
                const optionEmployees = {
                    method: methodEmployees,
                    url: urlEmployees,
                    headers: headersEmployees
                }

                request(optionEmployees).then (response => {
                    setEmployees(response.officers)
                    setDataReceived(true)
                    setDataLoading(true)
                }).catch(error => {
                    console.log(error.toJSON())
                })
            }).catch(error => {
                console.log(error.toJSON())
                setDataReceived(false)
                setDataLoading(true)
            })
        }
    }, [authorization, id, token])


    useEffect (() => {
        if (dataBeforeFormatting) {
            const dataDates = changeFormData(theft)
            setTheft({...theft, ...dataDates})
            setInitialData({...theft, ...dataDates})
            setDataBeforeFormatting(false)
        }
    }, [dataBeforeFormatting, theft])

    useEffect (() => {
        if (theft[THEFT_REPORT_TYPES.STATUS] !== MESSAGE_STATUS.DONE) {
            setInvisibleResolution(true)
        } else {
            setInvisibleResolution(false)
        }
    }, [theft])

    return (
        <div>
            {dataLoading
                ?   <>
                        {dataReceived
                            ?   <div className={css.data_theft}>
                                    <p className={css.unchanged_data}>{THEFT_REPORT_COPY[THEFT_REPORT_TYPES.CLIENTID]}:<span>{theft[THEFT_REPORT_TYPES.CLIENTID]}</span></p>
                                    <p className={css.unchanged_data}>{THEFT_REPORT_COPY[THEFT_REPORT_TYPES.CREATEDAT]}:<span>{theft[THEFT_REPORT_TYPES.CREATEDAT]}</span></p>
                                    <p className={css.unchanged_data}>{THEFT_REPORT_COPY[THEFT_REPORT_TYPES.UPDATEDAT]}:<span>{theft[THEFT_REPORT_TYPES.UPDATEDAT]}</span></p>
                                    <form className={css.editable_data} onSubmit={handleSubmit}>
                                        <label>{THEFT_REPORT_COPY[THEFT_REPORT_TYPES.STATUS]}:
                                            <select value={theft[THEFT_REPORT_TYPES.STATUS]} name={[THEFT_REPORT_TYPES.STATUS]} onChange={handleChange}>
                                                {Object.values(MESSAGE_STATUS).map(status => {
                                                    return <option key={status} value={status}>{status}</option>
                                                })}
                                            </select>
                                        </label>
                                        <label>{THEFT_REPORT_COPY[THEFT_REPORT_TYPES.LICENSENUMBER]}:<input value={emptyInput(theft[THEFT_REPORT_TYPES.LICENSENUMBER])} name={[THEFT_REPORT_TYPES.LICENSENUMBER]} onChange={handleChange}/></label>
                                        <label>{THEFT_REPORT_COPY[THEFT_REPORT_TYPES.OWNERFULLNAME]}:<input value={emptyInput(theft[THEFT_REPORT_TYPES.OWNERFULLNAME])} name={[THEFT_REPORT_TYPES.OWNERFULLNAME]} onChange={handleChange}/></label>
                                        <label>{THEFT_REPORT_COPY[THEFT_REPORT_TYPES.TYPE]}:
                                            <select value={theft[THEFT_REPORT_TYPES.TYPE]} name={[THEFT_REPORT_TYPES.TYPE]} onChange={handleChange}>
                                                {Object.values(BIKE_TYPE).map(type => {
                                                    return <option key={type} value={type}>{type}</option>
                                                })}
                                            </select>
                                        </label>
                                        <label>{THEFT_REPORT_COPY[THEFT_REPORT_TYPES.COLOR]}:<input value={emptyInput(theft[THEFT_REPORT_TYPES.COLOR])} name={[THEFT_REPORT_TYPES.COLOR]} onChange={handleChange}/></label>
                                        <label>{THEFT_REPORT_COPY[THEFT_REPORT_TYPES.DATE]}:<input type="date" value={emptyInput(theft[THEFT_REPORT_TYPES.DATE])} name={[THEFT_REPORT_TYPES.DATE]} onChange={handleChange}/></label>
                                        <label>{THEFT_REPORT_COPY[THEFT_REPORT_TYPES.OFFICER]}:
                                            <select value={emptyInput(theft[THEFT_REPORT_TYPES.OFFICER])} name={[THEFT_REPORT_TYPES.OFFICER]} onChange={handleChange}>
                                                {!initialData[THEFT_REPORT_TYPES.OFFICER] && (
                                                    <option key={0} value={""}>{""}</option>
                                                )}
                                                {employees.map(employee => {
                                                    if (employee[RESPONSIBLE_OFFICER_TYPES.APPROVED]) {
                                                        return <option key={employee[RESPONSIBLE_OFFICER_TYPES.ID]} value={employee[RESPONSIBLE_OFFICER_TYPES.ID]}>{employee[RESPONSIBLE_OFFICER_TYPES.EMAIL]}</option>
                                                    } else return null
                                                })}
                                            </select>
                                        </label>
                                        <label>{THEFT_REPORT_COPY[THEFT_REPORT_TYPES.DESCRIPTION]}:</label>
                                        <textarea value={emptyInput(theft[THEFT_REPORT_TYPES.DESCRIPTION])} name={[THEFT_REPORT_TYPES.DESCRIPTION]} onChange={handleChange}/>
                                        {!invisibleResolution && (
                                            <>
                                                <label>{THEFT_REPORT_COPY[THEFT_REPORT_TYPES.RESOLUTION]}:</label>
                                                <textarea value={emptyInput(theft[THEFT_REPORT_TYPES.RESOLUTION])} name={[THEFT_REPORT_TYPES.RESOLUTION]} onChange={handleChange}/>
                                            </>
                                        )}
                                        <button className={css.submit} type='submit'>Изменить</button>
                                    </form>
                                    {loading && <p className={css.loading}>Загрузка...</p>}
                                </div>
                            :   <h2>Кражи с id: {id} не существует</h2>
                        }
                    </>
                :   <Loading/>
            }
        </div>
    );
}