import { useContext, useState, useEffect } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { UserContext } from '../../context';
import { request } from '../../requests';
import { THEFT_REPORT_TYPES } from '../../config';
import { formatDate, isEmpty } from '../../utils'
import Loading from '../loading';
import TheftDetail from '../theft-detail';
import AuthorizationFailed from '../authorization-failed';
import css from './theft.module.css';

export default function Theft() {
    const { token, authorization } = useContext(UserContext)

    const [thefts, setThefts] = useState([])

    const [dataLoading, setDataLoading] = useState(false)

    const [theftsEmpty, setTheftsEmpty] =useState(false)

    const requestThefts = () => {
        const method = 'get'
      
        const url = 'cases/'
    
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
            const arrayThefts = response.data

            for (let keyThefts in response.data) {
                for (let keyTheft in response.data[keyThefts]) {
                    if (keyTheft === THEFT_REPORT_TYPES.DATE) {
                        if (arrayThefts[keyThefts][keyTheft]) {
                            arrayThefts[keyThefts][keyTheft] = formatDate(arrayThefts[keyThefts][keyTheft])
                        } else {
                            arrayThefts[keyThefts][keyTheft] = 'Нет даты'
                        }
                    }
                }
            }
            setThefts(arrayThefts)
            setDataLoading(true)
        }).catch(error => {
            console.log(error.toJSON())
        })
    }

    useEffect (() => {
        if (authorization && token) {
            requestThefts()
        }
    }, [authorization])

    const handleClick = (id) => {
        const method = 'delete'
      
        const url = `cases/${id}`
    
        const headers = {
            'Authorization': `Bearer ${token}`
        }
    
        const option = {
            method: method,
            url: url,
            headers: headers
        }
        request(option).catch(error => {
            console.log(error.toJSON())
        })
        
        setThefts((prev) => prev.filter(theft => theft._id !== id))
    }

    useEffect(()=> {
        setTheftsEmpty(isEmpty(thefts))
    }, [thefts])

    return (
        <div>
            {authorization
                ?   <Switch>
                        <Route exact path={'/theft'}>
                            <div className={css.thefts}>
                                {dataLoading
                                    ?   <div>
                                            {theftsEmpty
                                                ?   <>
                                                        {thefts.map( theft => {
                                                            return(
                                                                <div className={css.theft} key={theft._id}>
                                                                    <Link to ={`/theft/${theft._id}`}>
                                                                        <div>
                                                                            <span>{theft[THEFT_REPORT_TYPES.LICENSENUMBER]}</span>
                                                                            <span className={css.theft_type}>{theft[THEFT_REPORT_TYPES.TYPE]}</span>
                                                                            <span>{theft[THEFT_REPORT_TYPES.OWNERFULLNAME]}</span>
                                                                            <span>{theft[THEFT_REPORT_TYPES.DATE]}</span>
                                                                        </div>
                                                                    </Link>
                                                                    <button onClick={() => handleClick(theft._id)}><span>x</span></button>
                                                                </div>
                                                            )
                                                        })}
                                                    </>
                                                :   <div className={css.thefts_empty}>
                                                        <p>Сообщений о краже нет</p>
                                                    </div>
                                            }
                                            
                                        </div>
                                    :   <Loading/>
                                }
                            </div>
                        </Route>
                        <Route path={'/theft/:id'}>
                            <TheftDetail requestThefts={requestThefts}/>
                        </Route>
                    </Switch>
                : <AuthorizationFailed />
            }
        </div>
    );
}