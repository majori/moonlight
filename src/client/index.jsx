import React from 'react';
import {render} from 'react-dom';
import {Router, Route, Link, hashHistory} from 'react-router';

import { createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import cfg from '../config';

import {
  default as reducer,
  defaultState as reducerDefaultState
} from './reducers/reducer';

import {setStoreToApi, socket} from './services/api';

// Import components
import Home from './components/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import Control from './components/Control';

// Import containers
import {PatchContainer} from './containers/Patch';

// Import styles
require('./main');

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const store = createStoreWithMiddleware(reducer, reducerDefaultState);
setStoreToApi(store);

// Dev options
if (cfg.env == 'development') {
  socket.on('connect', function () {
    console.log('Connected, id: '+socket.id);
  });
  socket.on('ping:req', (timestamp) => {
      socket.emit('ping:res', timestamp);
  });
}

const App = React.createClass({
  render () {
    return (
      <div className='site-wrapper'>
        <Header />
        <div className='app-container'>
          {this.props.children}
        </div>
        <Footer />
      </div>
    );
  }
});

const routes =  <Route component={App}>
  <Route path='/' component={Home} />
  <Route path='/patch' component={PatchContainer} />
  <Route path='/control' component={Control} />
</Route>


render((
  <Provider store={store}>
    <Router history={hashHistory}>{routes}</Router>
  </Provider>
), document.getElementById('app'));
