export type TUserObject = { uid?: string; username?: string, online?: boolean };

export type TMessageObject = { id?: string; from?: string | TUserObject, to?: string | TChannelObject, content?: string; timestamp?: string | Date; };

export type TChannelObject = {
  id?: string;
  title?: string;
  description?: string;
  creator?: TUserObject | string;
  members?: TUserObject[];
  messages?: TMessageObject[];
  countMembers?: number;
};

export declare type Identifier = string;

export interface IRecord {
  id: Identifier;
  [key: string]: any;
}

export interface GetListParams {
  id: Identifier;
}

export interface GetListResult<RecordType extends IRecord = IRecord> {
  items: RecordType[];
}

export interface GetOneParams {
  id: Identifier;
}

export interface GetOneResult<RecordType extends IRecord = IRecord> {
  data: RecordType;
  values: RecordOptions;
}

export declare type OptionType = {
  value: string;
  label: string;
};

export interface RecordOptions {
  [k: string]: OptionType[];
}

export interface UpdateParams<T = any> {
  id: Identifier;
  data: T;
}
export interface UpdateResult<RecordType extends IRecord = IRecord> {
  data: RecordType;
}
export interface CreateParams<T = any> {
  data: T;
}
export interface CreateResult<RecordType extends IRecord = IRecord> {
  data: RecordType;
}
export interface DeleteParams {
  id: Identifier;
}
export interface DeleteResult<RecordType extends IRecord = IRecord> {
  data: RecordType;
}