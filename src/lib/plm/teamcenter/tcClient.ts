import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

type TcUidObject = { uid: string; type: string };

export class TcClient {
    private api: ReturnType<typeof axios.create>;
    private fsc: ReturnType<typeof axios.create>;

    private isAbsoluteUrl(u: string) {
        return /^https?:\/\//i.test(u);
    }

    constructor(baseUrl: string, fscUrl?: string) {
        const normalizedBase = baseUrl.replace(/\/+$/, '');

        // JSON/Rest services client (8080 typically)
        this.api = axios.create({
            baseURL: normalizedBase,
            withCredentials: true,
            xsrfCookieName: 'XSRF-TOKEN',
            xsrfHeaderName: 'X-XSRF-TOKEN',
            timeout: 30000
        });

        // FSC client (4544 typically)
        // If caller doesn't pass fscUrl, derive it from baseUrl host
        const normalizedFsc = (
            fscUrl
                ? fscUrl                              // e.g. "/fsc" in dev proxy
                : this.isAbsoluteUrl(normalizedBase)  // e.g. "http://host:8080"
                    ? this.deriveFscUrl(normalizedBase) // -> "http://host:4544"
                    : '/fsc'                            // fallback for relative baseUrl
        ).replace(/\/+$/, '');

        this.fsc = axios.create({
            baseURL: normalizedFsc,
            withCredentials: true,
            timeout: 60000,
            // default for downloads; can be overridden per request
            responseType: 'arraybuffer'
        });
    }

    private deriveFscUrl(baseUrl: string): string {
        // Examples:
        //  http://helixcoredev01:8080  -> http://helixcoredev01:4544
        //  https://host/somepath       -> https://host:4544
        console.log("deriveFscUrl baseUrl =", baseUrl);

        const u = new URL(baseUrl);
        u.port = '4544';
        u.pathname = '';
        u.search = '';
        u.hash = '';
        return u.toString().replace(/\/+$/, '');
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

    async getPropertiesOne(object: TcUidObject, attributes: string[]) {
        return this.getProperties([object], attributes);
    }

    async getRefList(object: TcUidObject) {
        return this.getPropertiesOne(object, ['ref_list']);
    }

    async getDatasetsForRevision(itemRevUid: string) {
        return this.getPropertiesOne({ uid: itemRevUid, type: 'ItemRevision' }, ['IMAN_specification']);
    }

    async getDatasetRefList(datasetUid: string) {
        return this.getRefList({ uid: datasetUid, type: 'Dataset' });
    }

    async getItemRevisions(itemUid: string) {
        return this.getProperties([{ uid: itemUid, type: 'Item' }], ['revision_list']);
    }

    /**
     * Get read tickets for one or more ImanFile objects.
     * You already confirmed this works with: { uid: "...", type: "ImanFile" }.
     */
    async getFileReadTickets(files: TcUidObject[]) {
        const payload = {
            header: { state: {}, policy: {} },
            body: { files }
        };

        const res = await this.api.post(
            '/tc/JsonRestServices/Core-2006-03-FileManagement/getFileReadTickets',
            payload,
            { headers: { 'Content-Type': 'application/json' } }
        );

        return res.data;
    }

    /**
     * Download bytes from FSC using a ticket.
     * Returns raw bytes + contentType (if provided by FSC).
     */
    async downloadFromFsc(ticket: string): Promise<{ bytes: ArrayBuffer; contentType: string }> {
        if (!ticket) throw new Error('Missing FSC ticket');

        const r = await this.fsc.get(`/fsc/download?ticket=${encodeURIComponent(ticket)}`, {
            responseType: 'arraybuffer'
        });

        const contentType =
            (String((r.headers as any)?.['content-type'] ?? '') || 'application/octet-stream').trim();

        return { bytes: r.data, contentType };
    }

    /**
     * Convenience: given an ImanFile UID, get a fresh ticket and immediately download.
     * This is the "always current ticket" behavior you want for JPG previews.
     *
     * NOTE: You may need to adjust the `extractTicket` logic to match your exact TC response shape.
     */
    async getJpgPreviewBytes(imanFileUid: string): Promise<{ bytes: ArrayBuffer; contentType: string }> {
        const ticketRes = await this.getFileReadTickets([{ uid: imanFileUid, type: 'ImanFile' }]);
        const ticket = this.extractTicket(ticketRes);

        if (!ticket) throw new Error('No ticket returned from getFileReadTickets');

        const dl = await this.downloadFromFsc(ticket);

        // If FSC doesn't send a helpful content-type, you can force jpeg for this endpoint.
        const contentType = dl.contentType.includes('image/') ? dl.contentType : 'image/jpeg';

        return { bytes: dl.bytes, contentType };
    }

    private extractTicket(ticketRes: any): string | null {
        // Your actual shape:
        // ticketRes.tickets = [ [ [ {uid...} ] ], [ [ "TICKETSTRING" ] ] ]  (effectively)
        //
        // From the sample:
        // ticketRes.tickets[1][0] is the ticket string

        const ticket = ticketRes?.tickets?.[1]?.[0];
        return typeof ticket === 'string' && ticket.length > 0 ? ticket : null;
    }


    async request<T = any>(cfg: AxiosRequestConfig): Promise<T> {
        const res = await this.api.request<T>(cfg);
        return res.data;
    }


}
