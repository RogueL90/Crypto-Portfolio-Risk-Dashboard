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
    return (await axios.post(url + 'addrequest', addRequest)).data
}

const getRequests = async () => {
    const res = await axios.get(url + 'requests')
    return res.data
}

export { postRequest, getRequests }