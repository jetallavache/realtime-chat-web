import React, { PropsWithChildren } from "react";
import { TChannelObject, TMessageObject, TUserObject } from "@/config/interfaces";

export interface IChannelContextState {
  channel: TChannelObject;
  owner: TUserObject;
  members: TUserObject[];
  messages: TMessageObject[];
}

export type RecordType = {
  title: string;
  creatorUid: string;
  description?: string | undefined;
};

export type TChannelContextAction =
  | "update_channel"
  | "update_owner"
  | "update_members"
  | "add_member"
  | "remove_member"
  | "update_messages"
  | "add_message"
  | "remove_message";

export type TChannelContextPayload =
  | RecordType
  | number
  | TUserObject[]
  | TMessageObject[]
  | TUserObject
  | TMessageObject;

export interface IChannelContextAction {
  type: TChannelContextAction;
  payload: TChannelContextPayload;
}

export interface IChannelContextProps {
  ChannelState: IChannelContextState;
  ChannelDispatch: React.Dispatch<IChannelContextAction>;
}

export interface IChannelContextComponentProps extends PropsWithChildren {}
