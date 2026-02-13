import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

export class TcClient {
    private api: ReturnType<typeof axios.create>;

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
        if (!user) throw new Error('Missing username');
        if (!password) throw new Error('Missing password');

        const payload = {
            header: {
                state: {},
                policy: {}
            },
            body: {
                credentials: {
                    user,
                    password,
                    role: '',
                    descrimator: '', // keep spelling as TC expects; odd but common
                    locale: '',
                    group: ''
                }
            }
        };

        await this.api.post(
            '/tc/JsonRestServices/Core-2011-06-Session/login',
            payload,
            { headers: { 'Content-Type': 'application/json' } }
        );
    }

    async performSearchViewModel6(term: string) {
        const payload = {
            "header": {
                "state": {},
                "policy": {}
            },
            "body": {
                "searchCriteria": [
                    {
                        "fieldName": "ItemID",
                        "fieldValue": term,
                        "searchOption": "Contains"
                    }
                ],
                "searchFilter": {
                    "maxNumToReturn": 100,
                    "maxResultsPerRelation": 100,
                    "returnProps": [
                        "object_name",
                        "object_type",
                        "item_id",
                        "last_mod_date",
                        "last_mod_user",
                        "object_desc"
                    ],
                    "pref": {
                        "maxNumToReturn": 100,
                        "maxResultsPerRelation": 100,
                        "returnProps": [
                            "object_name",
                            "object_type",
                            "item_id",
                            "last_mod_date",
                            "last_mod_user",
                            "object_desc"
                        ]
                    }
                }
            }
        };
        const res = await this.api.post(
            '/tc/RestServices/Internal-AWS2-2025-06-Finder/performSearchViewModel6',
            payload,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return res.data;
    }



    async request<T = any>(cfg: AxiosRequestConfig): Promise<T> {
        const res = await this.api.request<T>(cfg);
        return res.data;
    }
}
