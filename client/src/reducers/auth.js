import { REGISTRATION_FAIL, REGISTRATION_SUCCESS } from '../actions/types';

const intialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null
};

export default function(state = intialState, action) {
  const { type, payload } = action;

  switch (type) {
    case REGISTRATION_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...payload,
        ...state,
        isAuthenticated: true,
        loading: false
      };
    case REGISTRATION_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    default:
      return state;
  }
}
