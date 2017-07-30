const initialState = {
  isFetching: false,
  uid: null,
  isLoggedIn: false,
  userName: null,
  countries: [],
  nonVisitedCountries: {},
  isUpdatingDB: false,
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case 'GET_USER_DATA_REQUEST':
      return Object.assign({}, state, {
        isFetching: true,
      });
    case 'GET_USER_DATA_RESPONSE':
      return Object.assign({}, state, {
        isFetching: false,
        uid: action.uid,
        isLoggedIn: action.isLoggedIn,
        userName: action.userName,
        countries: action.countries,
        nonVisitedCountries: action.nonVisitedCountries,
      });
    case 'GET_USER_DATA_ERROR':
      return Object.assign({}, state, {
        isFetching: false,
      });
    case 'UPDATE_USER_COUNTRIES_REQUEST':
      return Object.assign({}, state, {
        isUpdatingDB: true,
      });
    case 'UPDATE_USER_COUNTRIES_RESPONSE':
      return Object.assign({}, state, {
        isUpdatingDB: false,
      });
    case 'UPDATE_USER_COUNTRIES_ERROR':
      return Object.assign({}, state, {
        isUpdatingDB: false,
      });
    default:
      return state
  }
}