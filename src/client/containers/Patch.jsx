import React from 'react';
import {connect} from 'react-redux';
import {fill} from 'lodash';
import {socket} from '../services/api';

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
            <table>
              <thead>
                <tr>
                   <th>Number</th>
                   <th>Head name</th>
                   <th>Channel name</th>
                </tr>
              </thead>
              <tbody>
              {
                this.props.channels.map((channel, index) => {
                  if (channel) {
                    return <PatchTableItem key={index+1} index={index+1} headName={channel.headName} channelName={channel.channelName}/>
                  } else {
                    return <PatchTableItem key={index+1} index={index+1}/>
                  }
                })
              }
              </tbody>
            </table>
          </div>
        );
    }
}

function mapStateToProps(state) {
  const heads = state.get('patch').get('heads').toJS();
  var arr = new Array(512);
  fill(arr, null);

  heads.forEach(head => {
    for (var i = head.startChannel; i < (head.startChannel+heads.channels.length-1); i++) {
      arr[i] = {headName: head.name, channelName: heads.channels[i]}
    }
  });
  return {
    channels: arr
  }
}

export const PatchContainer = connect(mapStateToProps)(Patch);
