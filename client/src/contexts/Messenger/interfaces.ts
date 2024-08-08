import React, { PropsWithChildren } from "react";
import { TChannelObject, TUserObject } from "@/config/interfaces";

export interface IMessengerContextState {
  user: TUserObject | null;
  channel: TChannelObject | null;
  users: TUserObject[];
  channels: TChannelObject[];
}

export type RecordType = {
  title: string;
  creatorUid: string;
  description?: string | undefined;
};

export type TMessengerContextAction =
  | "update_user"
  | "update_channel"
  | "update_channels"
  | "add_channel"
  | "remove_channel"
  | "update_users"
  | "add_user"
  | "remove_user";

export type TMessengerContextPayload =
  | string
  | TUserObject
  | TUserObject[]
  | TChannelObject
  | TChannelObject[]
  | null;

export interface IMessengerContextAction {
  type: TMessengerContextAction;
  payload: TMessengerContextPayload;
}

export interface IMessengerContextProps {
  MessengerState: IMessengerContextState;
  MessengerDispatch: React.Dispatch<IMessengerContextAction>;
}

export interface IMessengerContextComponentProps extends PropsWithChildren {}
