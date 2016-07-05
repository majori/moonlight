import React from 'react';
import {connect} from 'react-redux';
import {socket} from '../services/api'

import PatchTableItem from '../components/PatchTableItem';

export default class Patch extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Patch';
    }
    componentWillMount() {

    }

    render() {
        return (
          <div className="patch-page">
            {
              this.props.universe.toArray().map(x => {
                return <span>{x}</span>;
              })
            }
          </div>
        );
    }
}

export const PatchContainer = connect(state => ({
  universe: state.get('universe')
}))(Patch);
