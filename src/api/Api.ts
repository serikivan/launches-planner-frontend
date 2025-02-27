/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Launch {
  /** Launch id */
  launch_id?: number;
  /**
   * Rocket
   * @minLength 1
   * @maxLength 50
   */
  rocket: string;
  /** Status */
  status?: "draft" | "deleted" | "formed" | "completed" | "rejected";
  /**
   * Creator
   * @minLength 1
   */
  creator?: string;
  /**
   * Moderator
   * @minLength 1
   */
  moderator?: string;
  /**
   * Formed at
   * @format date-time
   */
  formed_at?: string | null;
  /**
   * Completed at
   * @format date-time
   */
  completed_at?: string | null;
  /**
   * Date
   * @format date
   */
  date?: string | null;
  /** Success */
  success?: boolean | null;
  /** QR code */
  qr?: string;
}

export interface LaunchStatus {
  /**
   * Status
   * @minLength 1
   */
  status: string;
}

export interface User {
  /**
   * Email адрес
   * @format email
   * @minLength 1
   * @maxLength 254
   */
  email: string;
  /**
   * Пароль
   * @minLength 1
   * @maxLength 128
   */
  password: string;
  /** Является ли пользователь менеджером? */
  is_staff?: boolean;
  /** Является ли пользователь админом? */
  is_superuser?: boolean;
}

export interface Satellite {
  /** Satellite id */
  satellite_id?: number;
  /**
   * Title
   * @minLength 1
   * @maxLength 255
   */
  title: string;
  /**
   * Description
   * @minLength 1
   */
  description: string;
  /**
   * Full desc
   * @minLength 1
   */
  full_desc: string;
  /** Status */
  status?: boolean;
  /**
   * Image url
   * @format uri
   * @minLength 1
   */
  image_url?: string | null;
  /** Weight */
  weight?: number | null;
  /**
   * Orbit
   * @minLength 1
   * @maxLength 255
   */
  orbit: string;
  /**
   * Expected date
   * @format date
   */
  expected_date: string;
}

export interface LaunchSatellite {
  satellite?: Satellite;
  /**
   * Order
   * @min 0
   * @max 2147483647
   */
  order?: number;
}

import type {AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

import Cookies from "js-cookie";

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
    /** set parameter to `true` for call `securityWorker` for this request */
    secure?: boolean;
    /** request path */
    path: string;
    /** content type of request body */
    type?: ContentType;
    /** query params */
    query?: QueryParamsType;
    /** format of response (i.e. response.json() -> format: "json") */
    format?: ResponseType;
    /** request body */
    body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
    securityWorker?: (
        securityData: SecurityDataType | null,
    ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
    secure?: boolean;
    format?: ResponseType;
}

export enum ContentType {
    Json = "application/json",
    FormData = "multipart/form-data",
    UrlEncoded = "application/x-www-form-urlencoded",
    Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
    public instance: AxiosInstance;
    private securityData: SecurityDataType | null = null;
    private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
    private secure?: boolean;
    private format?: ResponseType;

    constructor({securityWorker, secure, format, ...axiosConfig}: ApiConfig<SecurityDataType> = {}) {
        this.instance = axios.create({
            ...axiosConfig, 
            baseURL: axiosConfig.baseURL || "https://localhost:8000/api",
            withCredentials: true
        });
        this.secure = secure;
        this.format = format;
        this.securityWorker = securityWorker;
    }

    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data;
    };

    protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
        const method = params1.method || (params2 && params2.method);

        return {
            ...this.instance.defaults,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {}),
            },
        };
    }

    protected stringifyFormItem(formItem: unknown) {
        if (typeof formItem === "object" && formItem !== null) {
            return JSON.stringify(formItem);
        } else {
            return `${formItem}`;
        }
    }

    protected createFormData(input: Record<string, unknown>): FormData {
        if (input instanceof FormData) {
            return input;
        }
        return Object.keys(input || {}).reduce((formData, key) => {
            const property = input[key];
            const propertyContent: any[] = property instanceof Array ? property : [property];

            for (const formItem of propertyContent) {
                const isFileType = formItem instanceof Blob || formItem instanceof File;
                formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
            }

            return formData;
        }, new FormData());
    }

    public request = async <T = any, _E = any>({
                                                   secure,
                                                   path,
                                                   type,
                                                   query,
                                                   format,
                                                   body,
                                                   ...params
                                               }: FullRequestParams): Promise<AxiosResponse<T>> => {
        const secureParams =
            ((typeof secure === "boolean" ? secure : this.secure) &&
                this.securityWorker &&
                (await this.securityWorker(this.securityData))) ||
            {};
        const requestParams = this.mergeRequestParams(params, secureParams);
        const responseFormat = format || this.format || undefined;

        if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
            body = this.createFormData(body as Record<string, unknown>);
        }

        if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
            body = JSON.stringify(body);
        }
        const csrfToken = Cookies.get('csrftoken');
        return this.instance.request({
            ...requestParams,
            headers: {
                ...(requestParams.headers || {}),
                ...(type ? {"Content-Type": type} : {}),
                ...(csrfToken ? {'X-CSRFToken': csrfToken} : {}),
            },
            params: query,
            responseType: responseFormat,
            data: body,
            url: path,
        });
    };
}

/**
 * @title Launches API
 * @version v1
 * @license BSD License
 * @baseUrl http://localhost:8000/api
 * @contact <contact@snippets.local>
 *
 * Launches Web Service
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  launches = {
    /**
     * No description
     *
     * @tags launches
     * @name LaunchesList
     * @request GET:/launches/
     * @secure
     */
    launchesList: (params?: { query: { status?: string; start_date?: string; end_date?: string } }) =>
      this.request<void, any>({
        path: `/launches/`,
        method: "GET",
        secure: true,
        query: params?.query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags launches
     * @name LaunchesRead
     * @request GET:/launches/{id}/
     * @secure
     */
    launchesRead: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/launches/${id}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags launches
     * @name LaunchesUpdate
     * @request PUT:/launches/{id}/
     * @secure
     */
    launchesUpdate: (id: string, data: Launch, params: RequestParams = {}) =>
      this.request<Launch, any>({
        path: `/launches/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags launches
     * @name LaunchesDelete
     * @request DELETE:/launches/{id}/
     * @secure
     */
    launchesDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/launches/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags launches
     * @name LaunchesFormCreate
     * @request POST:/launches/{id}/form/
     * @secure
     */
    launchesFormCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/launches/${id}/form/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags launches
     * @name LaunchesModerateCreate
     * @request POST:/launches/{id}/moderate/
     * @secure
     */
    launchesModerateCreate: (id: string, data: LaunchStatus, params: RequestParams = {}) =>
      this.request<LaunchStatus, any>({
        path: `/launches/${id}/moderate/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  login = {
    /**
     * No description
     *
     * @tags login
     * @name LoginCreate
     * @request POST:/login/
     * @secure
     */
    loginCreate: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/login/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  logout = {
    /**
     * No description
     *
     * @tags logout
     * @name LogoutCreate
     * @request POST:/logout/
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  profile = {
    /**
     * No description
     *
     * @tags profile
     * @name ProfileUpdate
     * @request PUT:/profile/
     * @secure
     */
    profileUpdate: (data: { id: number; username?: string; password?: string }, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/profile/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  register = {
    /**
     * No description
     *
     * @tags register
     * @name RegisterCreate
     * @request POST:/register/
     * @secure
     */
    registerCreate: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/register/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  satellites = {
    /**
     * No description
     *
     * @tags satellites
     * @name SatellitesList
     * @request GET:/satellites/
     * @secure
     */
    satellitesList: (params?: { satellite_title: any }) =>
      this.request<void, any>({
        path: `/satellites/`,
        method: "GET",
        secure: true,
        query: params,
        ...params,
      }),

    /**
     * No description
     *
     * @tags satellites
     * @name SatellitesCreate
     * @request POST:/satellites/
     * @secure
     */
    satellitesCreate: (data: Satellite, params: RequestParams = {}) =>
      this.request<Satellite, any>({
        path: `/satellites/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags satellites
     * @name SatellitesRead
     * @request GET:/satellites/{id}/
     * @secure
     */
    satellitesRead: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/satellites/${id}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags satellites
     * @name SatellitesUpdate
     * @request PUT:/satellites/{id}/
     * @secure
     */
    satellitesUpdate: (id: string, data: Satellite, params: RequestParams = {}) =>
      this.request<Satellite, any>({
        path: `/satellites/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags satellites
     * @name SatellitesDelete
     * @request DELETE:/satellites/{id}/
     * @secure
     */
    satellitesDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/satellites/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags satellites
     * @name SatellitesAddImageCreate
     * @request POST:/satellites/{id}/add-image/
     * @secure
     */
    satellitesAddImageCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/satellites/${id}/add-image/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags satellites
     * @name SatellitesAddToDraftCreate
     * @request POST:/satellites/{id}/add-to-draft/
     * @secure
     */
    satellitesAddToDraftCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/satellites/${id}/add-to-draft/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags satellites
     * @name SatellitesManageDraftUpdate
     * @request PUT:/satellites/{id}/manage-draft/
     * @secure
     */
    satellitesManageDraftUpdate: (id: string, data: {order: string }, params: RequestParams = {}) =>
      this.request<LaunchSatellite, any>({
        path: `/satellites/${id}/manage-draft/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags satellites
     * @name SatellitesManageDraftDelete
     * @request DELETE:/satellites/{id}/manage-draft/
     * @secure
     */
    satellitesManageDraftDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/satellites/${id}/manage-draft/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
}