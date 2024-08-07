export type Message = {
  id: string;
  content: string;
  userName: string;
  userId: string;
  channelId: string;
  date: string;
};

export type User = {
  uid: string;
  name: string;
};
export type Channel = {
  id: string;
  title: string;
  description: string;
  creator: string;
  countMembers: string;
};
