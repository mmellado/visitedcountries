import React, { Component } from 'react';
import { Provider } from 'react-redux'
import { render } from 'react-dom';

import store from './store/store.js';
import Router from './router';

import './scss/main.scss';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '1639130619470630',
    cookie     : true,
    xfbml      : true,
    version    : 'v2.8'
  });
  FB.AppEvents.logPageView();
  render(<App />, document.getElementById('app'));
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));