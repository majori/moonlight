import React from 'react';
import {render} from 'react-dom';
import { Router, Route, Link, hashHistory} from 'react-router';

import Home from "./components/Home";
import Patch from "./components/Patch";
import Header from "./components/Header";
import Footer from "./components/Footer";

require('./main');

const App = React.createClass({
  render () {
    return (
      <div className="site__wrapper">
        <Header />
        <div className="app__container">
          {this.props.children}
        </div>
        <Footer />
      </div>
    );
  }
});

render((
  <Router>
    <Route history={hashHistory}>
      <Route component={App}>
        <Route path='/' component={Home} />
        <Route path='/patch' component={Patch} />
      </Route>
    </Route>
  </Router>

), document.getElementById('app'));
