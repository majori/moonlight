import React from 'react';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Home';
    }
    render() {
        return (
            <div className="my-container">
              Home-page
            </div>
        );
    }
}

