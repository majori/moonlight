import React from 'react';
import {Link} from 'react-router';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Header';
    }
    render() {
        return (
        <div>
          <span>Links: </span>
          <Link to="/">Home</Link>
          <Link to="/patch">Patch</Link>
        </div>
        );
    }
}

export default Header;
