export type UserState = {
  isLogged: boolean;
  id: string | null;
  username: string | null;
};

export type UserAction = {
  type: string;
  payload: {
    id: string;
    username: string;
  };
};

export type AppState = {
  inChannel: boolean;
  displayedGroups: [];
  messages: [];
  members: [];
  groups: [];
  currentGroup: null;
  modal: null | "bug" | "edit" | "create";
};

export type AppAction = {
  type: string;
  payload: {
    currentGroup: {};
    displayedGroups: [];
    groups: [];
    messages: [];
    members: [];
    modal: null | "bug" | "edit" | "create";
  };
};
