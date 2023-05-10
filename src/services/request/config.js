import server from '../../../public/server.json'
 let BASE_URL = server.base_url
 console.log(server, import.meta.env.MODE)
export { BASE_URL }
export const TIMEOUT = 10000
