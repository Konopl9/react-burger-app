import {delay, put, call} from 'redux-saga/effects';
import axios from 'axios';
import * as actions from '../actions/index';
import {logout} from '../actions/index';

export function*  logoutSaga(action) {
  yield call([localStorage, 'removeItem'], "token")
  yield call([localStorage, 'removeItem'], "expirationTime")
  yield call([localStorage, 'removeItem'], "userId")
  yield put(actions.logoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
  yield delay(action.expirationTime * 1000);
  yield put(actions.logout())
}

export function* authUserSaga(action) {
  yield put(actions.authStart())
  const authData = {
    email: action.email,
    password: action.password,
    returnSecureToken: true
  };
  let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCTbjwE-lki7O9GkFPoPxDPhOs4bLRy7tY';
  if (!action.isSignup) {
    url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCTbjwE-lki7O9GkFPoPxDPhOs4bLRy7tY';
  }
  try {
    const response = yield axios.post(url, authData)
    const expirationTime = yield new Date(new Date().getTime() + response.data.expiresIn * 1000);
    //access local storage for key and time. Required to don't lose auth state after refreshing the page
    yield localStorage.setItem('token', response.data.idToken);
    yield localStorage.setItem('expirationTime', expirationTime);
    yield localStorage.setItem('userId', response.data.localId);
    yield put(actions.authSuccess(response.data.idToken, response.data.localId));
    yield put(actions.checkAuthTimeout(response.data.expiresIn));
  } catch (error) {
    yield put(actions.authFail(error.response.data.error))
  }
}

export function* authCheckStateSaga(action) {
  const token = yield localStorage.getItem('token');
  if (!token) {
    yield put(actions.logout());
  } else {
    const expirationTime = yield new Date(localStorage.getItem('expirationTime'));
    if (expirationTime <= new Date()) {
      yield put(logout());
    } else {
      const userId = yield localStorage.getItem('userId');
      yield put(actions.authSuccess(token, userId));
      // time when user will be log put - current time = time to log out
      yield put(actions.checkAuthTimeout((expirationTime.getTime() - new Date().getTime()) / 1000));
    }
  }
}