import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context';
import { request } from '../../requests';
import { CLIENTID, RESPONSIBLE_OFFICER_TYPES, THEFT_REPORT_TYPES, THEFT_REPORT_COPY, BIKE_TYPE } from '../../config';
import css from './form-report-theft.module.css';

export default function FormReportTheft() {
    const { authorization, token } = useContext(UserContext)

    const [employees, setEmployees] = useState({})

    const [loading, setLoading] = useState(true)

    const [sendingData, setSendingData] = useState(false)

    const [dataReceived, setDataReceived] = useState(false)

    const [values, setValues] = useState({
        [THEFT_REPORT_TYPES.LICENSENUMBER]: '',
        [THEFT_REPORT_TYPES.OWNERFULLNAME]: '',
        [THEFT_REPORT_TYPES.TYPE]: '',
        [THEFT_REPORT_TYPES.CLIENTID]: CLIENTID,
        [THEFT_REPORT_TYPES.COLOR]: '',
        [THEFT_REPORT_TYPES.DATE]: '',
        [THEFT_REPORT_TYPES.DESCRIPTION]: '',
        [THEFT_REPORT_TYPES.OFFICER]: '',
    })

    const handleChange = e => {
		const fieldName = e.target.name
		setValues({...values, [fieldName]: e.target.value})
	}

    const handleSubmit = e => {
        e.preventDefault()

        if (values[THEFT_REPORT_TYPES.LICENSENUMBER] && values[THEFT_REPORT_TYPES.OWNERFULLNAME] && values[THEFT_REPORT_TYPES.TYPE]) {
            setSendingData(true)

            const method = 'post'

            const data = {}

            if (authorization) {
                const url = `cases/`
        
                const headers = {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
        
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
        
                request(option).then(() => {
                    setSendingData(false)
                }).catch(error => {
                    console.log(error.toJSON())
                    setSendingData(false)
                })
            } else {
                const url = `public/report`

                const headers = {
                    'Content-type': 'application/json'
                }
        
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
        
                request(option).then(() => {
                    setSendingData(false)
                }).catch(error => {
                    console.log(error.toJSON())
                    setSendingData(false)
                })
            }
        } else {
            alert(`Обязательно для ввода ${THEFT_REPORT_COPY[THEFT_REPORT_TYPES.LICENSENUMBER]}, ${THEFT_REPORT_COPY[THEFT_REPORT_TYPES.OWNERFULLNAME]}, ${THEFT_REPORT_COPY[THEFT_REPORT_TYPES.TYPE]}`)
        }
    }

    useEffect(() => {
        if (authorization && token) {
            setLoading(false)
            const method = 'get'
          
            const url = 'officers/'
        
            const headers = {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        
            const option = {
                method: method,
                url: url,
                headers: headers
            }

            request(option).then (response => {
                setEmployees(response.officers)
                setDataReceived(true)
                setLoading(true)
            }).catch(error => {
                console.log(error.toJSON())
            })
        } else {
            setValues(prev => {
                const update = {[THEFT_REPORT_TYPES.OFFICER]: ''}
                return {...prev, ...update}
            })
        }
    }, [authorization, token])

    useEffect(() => {
        setValues(prev => {
            const update = {[THEFT_REPORT_TYPES.TYPE]: BIKE_TYPE.GENERAL}
            return {...prev, ...update}
        })
    }, [])

    return (
        <form className={css.form} onSubmit={handleSubmit}>
            {loading
                ?   <div>
                        <h2 className={css.h2}>Сообщить о краже</h2>
                        <div className={css.div_input}>
                            <label>{THEFT_REPORT_COPY[THEFT_REPORT_TYPES.LICENSENUMBER]}<input name={[THEFT_REPORT_TYPES.LICENSENUMBER]} value={values[THEFT_REPORT_TYPES.LICENSENUMBER]} onChange={handleChange}/></label>
                            <label>{THEFT_REPORT_COPY[THEFT_REPORT_TYPES.OWNERFULLNAME]}<input name={[THEFT_REPORT_TYPES.OWNERFULLNAME]} value={values[THEFT_REPORT_TYPES.OWNERFULLNAME]} onChange={handleChange}/></label>
                            <label>{THEFT_REPORT_COPY[THEFT_REPORT_TYPES.TYPE]}
                                <select name={[THEFT_REPORT_TYPES.TYPE]} value={values[THEFT_REPORT_TYPES.TYPE]} onChange={handleChange}>
                                    {Object.values(BIKE_TYPE).map(type => {
                                        return <option key={type} value={type}>{type}</option>
                                    })}
                                </select>
                            </label>
                            <label>{THEFT_REPORT_COPY[THEFT_REPORT_TYPES.COLOR]}<input name={[THEFT_REPORT_TYPES.COLOR]} value={values[THEFT_REPORT_TYPES.COLOR]} onChange={handleChange}/></label>
                            <label>{THEFT_REPORT_COPY[THEFT_REPORT_TYPES.DATE]}<input type="date" name={[THEFT_REPORT_TYPES.DATE]} value={values[THEFT_REPORT_TYPES.DATE]} onChange={handleChange}/></label>
                            <label>{THEFT_REPORT_COPY[THEFT_REPORT_TYPES.DESCRIPTION]}</label>
                            <textarea name={[THEFT_REPORT_TYPES.DESCRIPTION]} value={values[THEFT_REPORT_TYPES.DESCRIPTION]} onChange={handleChange}></textarea>
                            {authorization && dataReceived && (
                                <label>{THEFT_REPORT_COPY[THEFT_REPORT_TYPES.OFFICER]}
                                    <select name={[THEFT_REPORT_TYPES.OFFICER]} value={values[THEFT_REPORT_TYPES.OFFICER]} onChange={handleChange}>
                                        <option key={0} value={null}>{null}</option>
                                        {employees.map(employee => {
                                            if (employee[RESPONSIBLE_OFFICER_TYPES.APPROVED]) {
                                                return <option key={employee[RESPONSIBLE_OFFICER_TYPES.ID]} value={employee[RESPONSIBLE_OFFICER_TYPES.ID]}>{employee[RESPONSIBLE_OFFICER_TYPES.EMAIL]}</option>
                                            } else return null
                                        })}
                                    </select>
                                </label>
                            )}
                            <button type='submit'>Отправить</button>
                            {sendingData && (
                                <p className={css.loading}>Отправка...</p>
                            )}
                        </div>
                    </div>
                :   <p className={css.loading}>Загрузка...</p>
            }
        </form>
    );
}