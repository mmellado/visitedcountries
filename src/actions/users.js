import 'isomorphic-fetch';
import countriesList from '../constants/countries';
import * as API_DATA from '../constants/api';

const API_URL = `${API_DATA.API_URL}${API_DATA.ENDPOINT}`;

function getUserDataRequest() {
  return {
    type: 'GET_USER_DATA_REQUEST',
  }
}

function getUserDataResponse(isLoggedIn, uid, userName, countries, nonVisitedCountries) {
  return {
    type: 'GET_USER_DATA_RESPONSE',
    isLoggedIn,
    uid,
    userName,
    countries,
    nonVisitedCountries,
  }
}

function getUserDataError() {
  return {
    type: 'GET_USER_DATA_ERROR',
  }
}

export function getUserData() {
  return dispatch => {
    dispatch(getUserDataRequest());

    FB.getLoginStatus(res => {
      const isLoggedIn = res.status === 'connected';  // 'connected' = true
      const uid = res.authResponse ? res.authResponse.userID : null;
      if (uid && isLoggedIn) {
        FB.api('/me', { fields: "name" }, res => {
          const userName = res.name;
          fetch(`${API_URL}/${uid}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          })
            .then(res => res.json())
            .then(res => {
              const nonVisitedCountries = Object.assign({}, countriesList);
              res.countries.map(c => {
                delete nonVisitedCountries[c];
              });
              dispatch(getUserDataResponse(isLoggedIn, uid, userName, res.countries, nonVisitedCountries));
            })
            .catch(err => {
              console.error(err); //eslint-disable-line no-console
              dispatch(getUserDataError());
            });
        });
      } else {
        dispatch(getUserDataResponse(false, null, null, [], null));
      }
    });
  }
}

function updateUserCountriesRequest() {
  return {
    type: 'UPDATE_USER_COUNTRIES_REQUEST',
  };
}

function updateUserCountriesResponse(countries, nonVisitedCountries) {
  return {
    type: 'UPDATE_USER_COUNTRIES_RESPONSE',
    countries,
    nonVisitedCountries,
  };
}

function updateUserCountriesError() {
  return {
    type: 'UPDATE_USER_COUNTRIES_ERROR',
  };
}

export function updateUserCountries(dirtyCountries) {
  return (dispatch, getState) => {
    const userState = getState().users;
    const uid = userState.uid;

    const countries = [];

    dirtyCountries.forEach(c => {
      countries.push(c);
    });

    countries.sort();

    const nonVisitedCountries = Object.assign({}, countriesList);
    countries.map(c => {
      delete nonVisitedCountries[c];
    });

    dispatch(updateUserCountriesRequest());

    fetch(`${API_URL}/${uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({countries}),
    })
      .then(() => dispatch(updateUserCountriesResponse(countries, nonVisitedCountries)))
      .catch(err => {
        console.error(err); //eslint-disable-line no-console
        dispatch(updateUserCountriesError());
      })
  }
}