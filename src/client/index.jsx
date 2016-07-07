import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import cfg from '../config';

import {
  default as reducer,
  defaultState as reducerDefaultState
} from './reducers/reducer';

import { setStoreToApi, socket } from './services/api';

// Import components
import Home from './elements/common/Home';
import Header from './elements/common/Header';
import Footer from './elements/common/Footer';
import Control from './elements/control/Control';

import PatchContainer from './elements/patch/PatchContainer';

// Import styles
require('./main');

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const store = createStoreWithMiddleware(reducer, reducerDefaultState);
setStoreToApi(store);

// Dev options
if (cfg.env === 'development') {
    socket.on('connect', () => {
        console.log('Connected, id: ' + socket.id);
    });
    socket.on('ping:req', (timestamp) => {
        socket.emit('ping:res', timestamp);
    });
}

class App extends React.Component {
    render() {
        return (
          <div className={'site-wrapper'}>
            <Header />
            <div className={'app-container'}>
              {this.props.children}
            </div>
            <Footer />
          </div>
        );
    }
}

App.propTypes = {
    children: React.PropTypes.element
};

const routes =  (<Route component={App}>
  <Route path={'/'} component={Home} />
  <Route path={'/patch'} component={PatchContainer} />
  <Route path={'/control'} component={Control} />
</Route>);


render((
  <Provider store={store}>
    <Router history={hashHistory}>{routes}</Router>
  </Provider>
), document.getElementById('app'));
