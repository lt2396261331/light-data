let BASE_URL = '/fl'
if (import.meta.env.MODE === 'production') {
 BASE_URL = 'http://47.101.133.246:8089'
}

export { BASE_URL }
export const TIMEOUT = 10000
