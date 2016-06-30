import React from 'react';
import {render} from 'react-dom';
import { Router, Route, Link, hashHistory} from 'react-router';
import io from 'socket.io-client';

import cfg from '../config';

// Import components
import Home from './components/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import Patch from './components/Patch';
import Control from './components/Control';

// Import styles
require('./main');

const socket = io.connect('http://'+cfg.httpAddress+':'+cfg.ioPort);

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

render((
  <Router history={hashHistory}>
    <Route>
      <Route component={App}>
        <Route path='/' component={Home} />
        <Route path='/patch' component={Patch} />
        <Route path='/control' component={Control} />
      </Route>
    </Route>
  </Router>

), document.getElementById('app'));
