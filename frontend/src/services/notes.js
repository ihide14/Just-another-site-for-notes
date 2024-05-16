import axios from 'axios'
const baseUrl = import.meta.env.VITE_BACKEND_NOTEURL || 'http://localhost:3001/api/notes'

const getAll = (token) => {
    const request = axios.get(baseUrl, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

const noteServices = {
    getAll,
    create,
    update
}

export default noteServices