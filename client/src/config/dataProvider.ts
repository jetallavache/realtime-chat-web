import {
    CreateParams,
    CreateResult,
    DeleteParams,
    DeleteResult,
    GetListParams,
    GetListResult,
    GetOneParams,
    GetOneResult,
    IRecord,
    UpdateParams,
    UpdateResult,
} from "./interfaces";
import _ from "./request";

type DataProvider = {
    getList: <RecordType extends IRecord = IRecord>(
        resource: string,
        params: GetListParams,
    ) => Promise<GetListResult<RecordType>>;
    getOne: <RecordType extends IRecord = IRecord>(
        resource: string,
        params: GetOneParams,
    ) => Promise<GetOneResult<RecordType>>;
    create: <RecordType extends IRecord = IRecord>(
        resource: string,
        params: CreateParams,
    ) => Promise<CreateResult<RecordType>>;
    update: <RecordType extends IRecord = IRecord>(
        resource: string,
        params: UpdateParams,
    ) => Promise<UpdateResult<RecordType>>;
    deleteOne: <RecordType extends IRecord = IRecord>(
        resource: string,
        params: DeleteParams,
    ) => Promise<DeleteResult<RecordType>>;
};

export default (apiUrl: string): DataProvider => ({
    getList: (resource, params) => {
        const url = `${apiUrl}/${resource}`;
        return _.get(url)({ params });
    },

    getOne: (resource, params) => {
        const url = `${apiUrl}/${resource}/${params.id}`;
        return _.get(url)({ params });
    },

    create: (resource, params) => {
        const url = `${apiUrl}/${resource}`;
        return _.post(url)({ data: params.data });
    },

    update: (resource, params) => {
        const url = `${apiUrl}/${resource}/${params.id}`;
        return _.patch(url)({ data: params.data });
    },

    deleteOne: (resource, params) => {
        const url = `${apiUrl}/${resource}/${params.id}`;
        return _.delete(url)();
    },
});
