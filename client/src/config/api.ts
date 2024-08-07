import _ from "./request";

const apiUrl =
  import.meta.env.VITE_CRM_API_URL || "http://localhost:3000/admin";

type apiType = {
  editorImageUpload: (uploadUrl: string, data: any) => Promise<string>;
  // getAjaxSelectOptions: (
  //     resource: string,
  //     field: string,
  //     query?: string,
  // ) => Promise<CustomOptionType>
  // getSettings: () => Promise<GetFormDataResult<ISettings>>
  // updateSettings: (data: any) => Promise<UpdateResult>
};

const api: apiType = {
  editorImageUpload: async (uploadUrl: string, data: any) => {
    const url = `${apiUrl}/${uploadUrl}`;
    const data_1 = await _.post(url)({ data });
    return data_1.location;
  },
  // getAjaxSelectOptions: async (resource, field, query) => {
  //     const url = `${apiUrl}/${resource}/ajax-select/${field}`
  //     return await _.get(url)({ params: { query } })
  // },
  // getSettings: () => {
  //     const url = `${apiUrl}/settings`
  //     return _.get(url)({})
  // },
  // updateSettings: (data) => {
  //     const url = `${apiUrl}/settings/update`
  //     return _.postFD(url)({ data })
  // },
};

export default api;
