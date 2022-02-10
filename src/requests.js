import axios from 'axios';

const request = (option) => {
    option.url = 'https://sf-final-project.herokuapp.com/api/' + option.url
    return axios (option)
    .then(response => {
        return response.data
    })
}
export { request }