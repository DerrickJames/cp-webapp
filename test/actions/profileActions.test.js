import expect from 'expect';
import * as profileActions from '../../src/redux/actions/profileActions';
import * as types from '../../src/redux/actions/actionTypes';
import { PROFILES_REQUEST, PROFILES_SUCCESS, PROFILES_FAILURE } from '../../src/constants';

import thunk from 'redux-thunk';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';

// test a sync action
describe('Profile Actions', () => {
    describe('createProfileSuccess', () => {
        it('should create a CREATE_PROFILE_SUCCESS action', () => {
            // arrange
            const profile = {id: "mushangi-derrick", firstName: "Mushangi", lastName: "Derrick"};
            const expectedAction = {
                type: types.CREATE_PROFILE_SUCCESS,
                profile: profile
            };

            // act
            const action = profileActions.createProfileSuccess(profile);

            // assert
            expect(action).toEqual(expectedAction);
        });
    });
});

const middleware  = [thunk];
const mockStore = configureMockStore(middleware);

// test async actions
describe('Async Actions', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('should create BEGIN_AJAX_CALL and CREATE_PROFILE_SUCCESS when saving a profile', (done) => {
      const profile = {firstName: "Mushangi", lastName: "Derrick"};

      const expectedActions = [
        {type: types.BEGIN_AJAX_CALL},
        {
          type: types.CREATE_PROFILE_SUCCESS,
          body: {profile: profile}
        }
      ];

      const store = mockStore({profile: {}, expectedActions});

      store.dispatch(profileActions.saveProfile(profile)).then(() => {
        const actions = store.getActions();

        expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
        expect(actions[1].type).toEqual(types.CREATE_PROFILE_SUCCESS);

        done();
      });
    });

    it('should create BEGIN_AJAX_CALL and UPDATE_PROFILE_SUCCESS when updating a profile', (done) => {
      const profile = {id: "mushangi-derrick", firstName: "Mushangi", lastName: "Derrick"};

      const expectedActions = [
        {type: types.BEGIN_AJAX_CALL},
        {
          type: types.UPDATE_PROFILE_SUCCESS,
          body: {profile: profile}
        }
      ];

      const store = mockStore({profile: {}, expectedActions});

      store.dispatch(profileActions.saveProfile(profile)).then(() => {
        const actions = store.getActions();

        expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
        expect(actions[1].type).toEqual(types.UPDATE_PROFILE_SUCCESS);

        done();
      });
    });

    it('should create BEGIN_AJAX_CALL and AJAX_CALL_ERROR when saving invalid profile data', (done) => {
      const profile = {firstName: " ", lastName: " "};

      const expectedActions = [
        {type: types.BEGIN_AJAX_CALL},
        {
          type: types.AJAX_CALL_ERROR,
          body: {profile: profile}
        }
      ];

      const store = mockStore({profile: {}, expectedActions});

      store.dispatch(profileActions.saveProfile(profile)).then(() => {})
      .catch(error => {
        const actions = store.getActions();

        expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
        expect(actions[1].type).toEqual(types.AJAX_CALL_ERROR);
        expect(error).toBe("Firstname must be at least 3 characters.");

        done();
      });
    });
});
