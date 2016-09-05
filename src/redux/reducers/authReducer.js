import * as types from '../actions/actionTypes';
import initialState from './initialState';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from '../../constants';

export default function authReducer(state = initialState.auth, action) {
  switch(action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, { isRequesting: true });

    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        token: action.data.token,
        //        currentUser: action.data.currentUser,
        isRequesting: false,
        isAuthenticated: true
      });

    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isRequesting: false,
        error: action.error
      });

    case types.CURRENT_USER_REQUEST:
      return Object.assign({}, state, action.payload);

    case types.CURRENT_USER_SUCCESS:
      return Object.assign({}, state, action.payload);

    case types.CURRENT_USER_FAILURE:
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
}
