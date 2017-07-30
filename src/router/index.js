import React, { Component } from 'react';

import Layout from '../containers/Layout';
import Home from '../containers/Home';
import {
  BrowserRouter,
  Route
} from 'react-router-dom';

export default class Router extends Component {
  render() {
    const routerProps = {};

    if (process.env.NODE_ENV === 'production') {
      routerProps.basename = '/visitedcountries';
    }

    return (
      <BrowserRouter {...routerProps}>
        <Layout>
          <Route exact path="/" component={Home}/>
        </Layout>
      </BrowserRouter>
    )
  }
}