import { TUserObject } from "./interfaces";
import _ from "./request";
import { storage } from "./storage";

interface AuthProvider {
  signup: (params: any) => Promise<any>;
  login: (params: any) => Promise<any>;
  checkUser: () => null | { data: TUserObject };
  logout: () => void;
}

const userStorageKey = "user_data";

const authProvider = (apiUrl: string): AuthProvider => ({
  signup: async (user: TUserObject) => {
    const url = `${apiUrl}/users/signup`;
    await _.post(url)({ data: user });
    storage.set<TUserObject>(userStorageKey, user);
  },
  login: async (user: { uid: string }) => {
    const url = `${apiUrl}/users/login`;
    const data = await _.post(url)({ data: user });
    storage.set<TUserObject>(userStorageKey, data.item);
    return data;
  },
  checkUser: () => {
    const user = storage.get<TUserObject>(userStorageKey);
    if (user) {
      return { data: user };
    } else {
      return null;
    }
  },
  logout: async () => {
    const user = storage.get<TUserObject>(userStorageKey);
    const url = `${apiUrl}/users/${user?.uid}/update`;
    await _.patch(url)({ data: {
      online: false,
    } });
    storage.remove(userStorageKey);
  },
});

export default authProvider;
