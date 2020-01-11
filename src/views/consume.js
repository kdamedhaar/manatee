import axios from 'axios';
let consumeBaseUrl = process.env.AGENT_URL + "/api/assets/consume";
const httpClient = axios.create();
httpClient.defaults.timeout = 3600;

export default async (did) => {
    let resp = await httpClient(`${consumeBaseUrl}?did=${did}`);
    console.log(resp)
}