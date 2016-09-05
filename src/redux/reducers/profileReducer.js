import initialState from './initialState';
import {
  PROFILES_REQUEST, PROFILES_SUCCESS, PROFILES_FAILURE
} from '../../constants';

export default function profileReducer(state = initialState.profiles, action) {
    switch(action.type) {
      case PROFILES_REQUEST:
        return Object.assign({}, state, { isRequesting: true });

      case PROFILES_SUCCESS:
        return Object.assign({}, state, {
          isRequesting: false,
          data: action.data.data
        });

      case PROFILES_FAILURE:
        return Object.assign({}, state, {
          isRequesting: false,
          error: action.error
        });

      default:
          return state;
    }
}
