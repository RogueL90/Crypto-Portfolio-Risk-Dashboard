import axios from 'axios'

const url = 'http://localhost:8000/'

const postRequest = async (days, coins) => {
    const addRequest = {
        days : days,
        coins : coins.map((coin) => ({
            symbol : coin[0],
            amt : coin[1]
        }))
    }
    const res = await axios.post(url + 'addrequest', addRequest)
    return res.data
}

const getRequests = async () => {
    const res = await axios.get(url + 'requests')
    return res.data
}

const analyze = async (reqId) => {
    const res = await axios.get(url + `analyze/${reqId}`)
    return res.data
}

export { postRequest, getRequests, analyze}