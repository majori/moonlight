import React from 'react';
import {Link} from 'react-router';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Header';
    }
    render() {
        return (
        <div className="header-wrapper pure-menu pure-menu-horizontal">
          <h1 className="header-title">
            Moonlight
          </h1>
          <ul className="header-links">
            <li><Link className="header-link" to="/patch">Patch</Link></li>
            <li><Link className="header-link" to="/control">Control</Link></li>
          </ul>
        </div>
        );
    }
}

export default Header;
