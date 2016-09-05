import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Login from './components/auth/Login';
import HomePage from './components/home/HomePage';
import AboutPage from './components/about/AboutPage';
import MainLayout from './components/common/MainLayout';
import AuthenticatedContainer from './containers/AuthenticatedContainer';
import toastr from 'toastr';
import { isEmpty } from './selectors';
import ProfilesPage from './components/profiles/ProfilesPage';
import ManageProfilePage from './components/profiles/ManageProfilePage'; // eslint-disable-line import/no-named-as-default
import * as actions from './redux/actions/authActions';

export default function configRoutes(store) {
  const checkAuthentication = (nextState, replace, callback) => {
    const { dispatch } = store;
    const { auth } = store.getState();
    const { isAuthenticated } = auth;
    let token = localStorage.getItem('fame.auth.token');

    if (token && !isAuthenticated) {
      const payload = {
        token: token,
        //currentUser: currentUser get from localStorage
        isAuthenticated: true
      };

      dispatch(actions.currentUserSuccess(payload));
    }

    if (isEmpty(token)) {
      toastr.info('Please login to view member pages.');
      replace('/login');
    }

    callback();
  };

  return (
    <Route path="/" component={App}>
        <IndexRoute component={HomePage} />

        <Route component={MainLayout}>
          <Route path="login" component={Login} />
          <Route path="about" component={AboutPage} />

          <Route component={AuthenticatedContainer} onEnter={checkAuthentication}>
            <Route path="profiles" component={ProfilesPage} />
            <Route path="profile/:id" component={ManageProfilePage} />
          </Route>
        </Route>
    </Route>
  );
}
