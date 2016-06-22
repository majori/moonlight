import React from 'react';
import {Link} from 'react-router';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Home';
    }
    render() {
        return (
            <div>
                <span>Links: </span>
                <Link to="/patch">Patch</Link>
            </div>
        );
    }
}

export default Home;
