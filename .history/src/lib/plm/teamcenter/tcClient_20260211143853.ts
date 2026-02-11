import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';


export class TcClient {
    private api: AxiosInstance;

    constructor(baseUrl: string) {
        this.api = axios.create({
            baseURL: baseUrl.replace(/\/+$/, ''),
            withCredentials: true,
            xsrfCookieName: 'XSRF-TOKEN',
            xsrfHeaderName: 'X-XSRF-TOKEN',
            timeout: 30000
        });
    }

    async login(user: string, password: string) {
        // Match the payload that works for YOUR TC setup.
        // If you used basic auth instead, we can switch this.
        const body = { userId: user, password };

        await this.api.post('/tc/JsonRestServices/Core-2011-06-Session/login', body);
    }

    async request<T = any>(cfg: AxiosRequestConfig): Promise<T> {
        const res = await this.api.request<T>(cfg);
        return res.data;
    }

    get<T = any>(url: string, cfg: AxiosRequestConfig = {}) {
        return this.request<T>({ ...cfg, method: 'GET', url });
    }

    post<T = any>(url: string, data?: any, cfg: AxiosRequestConfig = {}) {
        return this.request<T>({ ...cfg, method: 'POST', url, data });
    }
}
