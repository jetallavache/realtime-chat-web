import { UserAction, UserState } from "./interfaces";

const initialState: UserState = {
  isLogged: false,
  id: null,
  username: null,
};

const reducer = (state = initialState, action: UserAction) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLogged: true,
        username: action.payload.username,
        id: action.payload.id,
      };

    case "LOGOUT":
      return {
        ...state,
        isLogged: false,
        username: null,
        image: null,
        token: null,
        id: null,
      };

    //   case 'GUEST':
    //     return {...state, isLogged: true, username: action.payload.username, id: action.payload.id}

    case "EDIT":
      return { ...state, isLogged: true, username: action.payload.username };

    default:
      return state;
  }
};

export default reducer;
