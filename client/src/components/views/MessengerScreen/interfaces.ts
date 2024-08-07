import { Identifier } from "@/config/dataProvider";

export type TRow = {
  id: Identifier;
  title: string;
  description: string;
  creator: string;
  countMembers: number;
};

export type TUser = {
  uid: string;
  username: string;
};
