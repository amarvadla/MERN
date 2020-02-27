import axios from 'axios';
import { setAlert } from './alert';
import { REGISTRATION_FAIL, REGISTRATION_SUCCESS } from './types';

export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/rest/user', body, config);

    dispatch({
      type: REGISTRATION_SUCCESS,
      payload: res.data.token
    });
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(element => {
        return dispatch(setAlert(element.msg, 'danger'));
      });
    }

    dispatch({
      type: REGISTRATION_FAIL
    });
  }
};
