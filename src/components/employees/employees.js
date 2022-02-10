import { useContext, useState, useEffect } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { UserContext } from '../../context';
import { RESPONSIBLE_OFFICER_TYPES } from '../../config';
import { request } from '../../requests';
import FormAddNewEmploye from '../form-add-new-employe'
import Loading from '../loading';
import EmployeeDetail from '../employe-detail';
import AuthorizationFailed from '../authorization-failed';
import css from './employees.module.css';

export default function Employees() {
    const { token, authorization } = useContext(UserContext)

    const [employees, setEmployees] = useState([])

    const [dataLoading, setDataLoading] = useState(false)

    const [isFormVisible, setFormVisible] = useState(false)
    
    const requestEmployees = () => {
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
            const arrayEmployees = response.officers
            for (let keyEmployees in arrayEmployees) {
                for (let keyEmployee in arrayEmployees[keyEmployees]) {
                    if (!arrayEmployees[keyEmployees][keyEmployee] && keyEmployee !== RESPONSIBLE_OFFICER_TYPES.APPROVED) {
                        arrayEmployees[keyEmployees][keyEmployee] = 'Нет данных'
                    }
                }
            }
            setEmployees(arrayEmployees)
            setDataLoading(true)
        }).catch(error => {
            console.log(error.toJSON())
        })
    }

    useEffect (() => {
        if (authorization && token) {
            requestEmployees()
        }
    }, [authorization])

    const handleClick = (id) => {
        const method = 'delete'
        
        const url = `officers/${id}`
        
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
        
        setEmployees((prev) => prev.filter(employees => employees[RESPONSIBLE_OFFICER_TYPES.ID] !== id))
    }

    const handleAddNewClick = () => {
        setFormVisible(!isFormVisible)
    }

    return (
        <div>
            {authorization
                ?   <Switch>
                        <Route exact path={'/employees'}>
                            <div className={css.employees}>
                                {dataLoading
                                    ?   <div>
                                            <div className={css.btn_block}>
                                                <button className={css.btn_add} onClick={handleAddNewClick}>Добавить</button>
                                            </div>
                                            {isFormVisible && (
                                                <FormAddNewEmploye employees = {employees} setEmployees={setEmployees}/>
                                            )}
                                            {employees.map( employee => {
                                                return(
                                                    <div className={css.employee} key={employee[RESPONSIBLE_OFFICER_TYPES.ID]}>
                                                        <Link to ={`/employees/${employee[RESPONSIBLE_OFFICER_TYPES.ID]}`}>
                                                            <div>
                                                                <span>{employee[RESPONSIBLE_OFFICER_TYPES.EMAIL]}</span>
                                                                <span className={css.firstName}>{employee[RESPONSIBLE_OFFICER_TYPES.FIRSTNAME]}</span>
                                                                <span className={css.lastName}>{employee[RESPONSIBLE_OFFICER_TYPES.LASTNAME]}</span>
                                                                <span>{employee[RESPONSIBLE_OFFICER_TYPES.APPROVED] ? 'Одобрен' : 'Не одобрен'}</span>
                                                            </div>
                                                        </Link>
                                                        <button onClick={() => handleClick(employee[RESPONSIBLE_OFFICER_TYPES.ID])}><span>x</span></button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    :   <Loading/>
                                }
                            </div>
                        </Route>
                        <Route path={'/employees/:id'}>
                            <EmployeeDetail requestEmployees={requestEmployees}/>
                        </Route>
                    </Switch>
                : <AuthorizationFailed />
            }
        </div>
    );
}