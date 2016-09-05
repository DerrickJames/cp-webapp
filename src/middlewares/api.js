import { browserHistory } from 'react-router';
import toastr from 'toastr';
import axios from 'axios';
import {beginAjaxCall, ajaxCallError} from '../redux/actions/ajaxStatusActions';

//const BASE_URL = 'http://localhost:8000/api/';
const BASE_URL = 'http://api.czekmaet.com/';

function callApi(data, method, endpoint, authenticated) {
  let url = BASE_URL + endpoint;
  let token = localStorage.getItem('fame.auth.token') || null;
  let config = { method, url };

  if (authenticated) {
    if (! token) {
      toastr.error('Token not found, please login.');
      browserHistory.push('login');
    }

    config.headers = { 'Authorization': `Bearer ${token}` };
  }

  if (data) {
    config.data = data;
  }

  return axios(config)
    .then(response => {
      let newToken = response.data.token;

      if (newToken) {
        localStorage.setItem('fame.auth.token', newToken);
      }

      // check  responseData
      return response;
    })
    .catch(error => {
      let payload = {};
      if (error.hasOwnProperty('status')) {
        let { status, data } = error;
        let err = (status == 422) ? data.errors : data;
        let errorMessage = [];

        if (Object.keys(data).length > 0) {
          if (data.hasOwnProperty('errors')) {
            Object.keys(data.errors).map(key => errorMessage.push(data.errors[key][0]));
          } else {
            errorMessage.push(data.message);
          }

          if (errorMessage.length == 0) return false;
          toastr.error(errorMessage.join('<br/>'));
        }

        if (status === 401) browserHistory.push('login');

        if (status >= 400) {
          //let { token, currentUser } = response.data;
          localStorage.removeItem('fame.auth.token');
          payload = {
            error: data,
            isAuthenticated: false
          };
        }
      }

      return payload;
    });
}

export const CALL_API = Symbol('Call API');

export default store => next => action => {
  const callAPI = action[CALL_API];

  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { data, method, endpoint, types, authenticated } = callAPI;
  const [ requestType, successType, errorType ] = types;

  next({ type: requestType });

  return callApi(data, method, endpoint, authenticated).then(
    response => {
      let { data } = response;

      next({ data, type: successType });
    },
    error => {
      next({ error, type: errorType });
    }
  ).catch(errorResponse => {});
};
