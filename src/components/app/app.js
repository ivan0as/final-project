import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { request } from '../../requests';
import { UserContext } from '../../context';
import Header from '../header';
import Main from '../main';
import Footer from '../footer';
import Loading from '../loading';
import css from './app.module.css';

function App() {
  const [user, setUser] = useState([])
  const [token, setToken] = useState(false)
  const [loading, setLoading] = useState(false)
  const [authorization, setAuthorization ] = useState(false)
  
  
  useEffect (() => {
    const method = 'get'
    
    const url = 'auth/'
    
    const getToken = window.localStorage.getItem('token')
  
    const headers = {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${getToken}`
    }
  
    const option = {
      method: method,
      url: url,
      headers: headers
    }

    if (getToken) {
      setLoading(true)

      if (!authorization) {
        request(option).then (responseData => {
          setUser(responseData)
          setLoading(false)
        }).catch(error => {
          if (error.toJSON().status !== 401) {
            console.log(error.toJSON())
          }
          setLoading(false)
        })
        setToken(getToken)
      } else {
        setLoading(false)
      }
    }
  }, [authorization])
  
  useEffect (() => {
    if (token) {
      window.localStorage.setItem('token', token)
    }
  }, [token])

  return (
    <BrowserRouter>
      <UserContext.Provider value={{user, setUser, token, setToken, authorization, setAuthorization}}>
        {loading
          ? <Loading />
          : <div className={css.app}>
              <Header />
              <Main />
              <Footer />
            </div>
        }
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
