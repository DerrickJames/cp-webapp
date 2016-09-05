import * as types from './actionTypes';
import { CALL_API } from '../../middlewares/api';
import profileApi from '../../api/mockProfileApi';
import {beginAjaxCall, ajaxCallError} from './ajaxStatusActions';
import {
  PROFILES_REQUEST, PROFILES_SUCCESS, PROFILES_FAILURE
} from '../../constants';

export function loadProfilesSuccess(profiles) {
    return { type: types.LOAD_PROFILES_SUCCESS, profiles };
}

export function createProfileSuccess(profile) {
    return { type: types.CREATE_PROFILE_SUCCESS, profile };
}

export function updateProfileSuccess(profile) {
    return { type: types.UPDATE_PROFILE_SUCCESS, profile };
}

export function loadProfiles() {
  return {
    [CALL_API]: {
      method: 'get',
      authenticated: true,
      endpoint: 'oauth/resource',
      types: [PROFILES_REQUEST, PROFILES_SUCCESS, PROFILES_FAILURE]
    }
  };
}

export function saveProfile(profile) {
    return function(dispatch) {
        dispatch(beginAjaxCall());

        return profileApi.saveProfile(profile).then(savedProfile => {
            profile.id ? dispatch(updateProfileSuccess(savedProfile)) :
                dispatch(createProfileSuccess(savedProfile));
        }).catch(error => {
            dispatch(ajaxCallError(error));
            throw(error);
        });
    };
}
