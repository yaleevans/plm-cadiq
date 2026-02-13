import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

type TcUidObject = { uid: string; type: string };

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
            header: { state: {}, policy: {} },
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

        await this.api.post('/tc/JsonRestServices/Core-2011-06-Session/login', payload, {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    async performSearchViewModel6(term: string) {
        const payload = {
            header: {
                state: {
                    clientVersion: '10000.1.2',
                    applicationName: 'Active Workspace',
                    applicationVersion: '2506',
                    logCorrelationID: 'Advanced/8',
                    stateless: true,
                    enableServerStateHeaders: true,
                    formatProperties: true,
                    unitSystem: 'As Authored',
                    clientID: 'ActiveWorkspaceClient',
                    groupMember: 'AsMAAAK9pLT5VC',
                    role: 'Designer',
                    locale: 'en_US'
                },
                policy: {
                    useRefCount: false,
                    types: [
                        {
                            name: 'ItemRevision',
                            properties: [{ name: 'item_id' }, { name: 'item_revision_id' }, { name: 'object_name' }]
                        },
                        {
                            name: 'Item',
                            properties: [
                                { name: 'is_vi' },
                                { name: 'checked_out_user', modifiers: [{ name: 'withProperties', Value: 'true' }] },
                                { name: 'checked_out_date' },
                                { name: 'object_string' }
                            ]
                        }
                    ]
                }
            },
            body: {
                searchInput: {
                    maxToLoad: 50,
                    maxToReturn: 50,
                    providerName: 'Awp0SavedQuerySearchProvider',
                    searchCriteria: {
                        queryUID: 'AkAAAAgUpLT5VC',
                        typeOfSearch: 'ADVANCED_SEARCH',
                        lastEndIndex: '',
                        totalObjectsFoundReportedToClient: '',
                        ItemID: term,
                        searchID: new Date().getTime().toString(),
                        utcOffset: '-300',
                        checkThreshold: '1'
                    },
                    searchFilterFieldSortType: 'Priority',
                    startIndex: 0,
                    searchFilterMap6: {},
                    searchSortCriteria: [],
                    attributesToInflate: [],
                    internalPropertyName: '',
                    columnFilters: [],
                    cursor: { startIndex: 0, endIndex: 0, startReached: false, endReached: false },
                    focusObjUid: '',
                    pagingType: ''
                },
                inflateProperties: false,
                columnConfigInput: {
                    clientName: '',
                    hostingClientName: '',
                    clientScopeURI: '',
                    operationType: '',
                    columnsToExclude: []
                },
                saveColumnConfigData: {
                    scope: '',
                    scopeName: '',
                    clientScopeURI: '',
                    columnConfigId: '',
                    columns: []
                },
                noServiceData: false
            }
        };

        const res = await this.api.post(
            '/tc/RestServices/Internal-AWS2-2025-06-Finder/performSearchViewModel6',
            payload,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return res.data;
    }

    async getProperties(objects: TcUidObject[], attributes: string[]) {
        const payload = {
            header: { state: {}, policy: {} },
            body: { objects, attributes }
        };

        const res = await this.api.post('/tc/JsonRestServices/Core-2006-03-DataManagement/getProperties', payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        return res.data; // ServiceData
    }

    // Optional convenience for single object calls
    async getPropertiesOne(object: TcUidObject, attributes: string[]) {
        return this.getProperties([object], attributes);
    }

    /**
     * Dataset/file references usually live on Dataset.ref_list (or CAD dataset-like objects)
     */
    async getRefList(object: TcUidObject) {
        return this.getPropertiesOne(object, ['ref_list']);
    }

    /**
     * ✅ FIX: datasets attached to an ItemRevision are NOT in ref_list.
     * They are typically in IMAN_specification (relation to Dataset).
     */
    async getDatasetsForRevision(itemRevUid: string) {
        return this.getPropertiesOne({ uid: itemRevUid, type: 'ItemRevision' }, ['IMAN_specification']);
    }

    /**
     * Given a Dataset UID, fetch its files via ref_list
     */
    async getDatasetRefList(datasetUid: string) {
        return this.getRefList({ uid: datasetUid, type: 'Dataset' });
    }

    /**
     * Given an Item UID, fetch revision_list (Item -> ItemRevision[])
     */
    async getItemRevisions(itemUid: string) {
        return this.getProperties([{ uid: itemUid, type: 'Item' }], ['revision_list']);
    }

    async request<T = any>(cfg: AxiosRequestConfig): Promise<T> {
        const res = await this.api.request<T>(cfg);
        return res.data;
    }
}