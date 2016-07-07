import React from 'react';
import { connect } from 'react-redux';
import { socket } from '../services/api';

import PatchTableItem from '../components/PatchTableItem';

export class Patch extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Patch';
    }

    componentWillMount() {
        // Request patched and unpatched heads from backend
        socket.emit('patch:patched_heads:req');
        socket.emit('patch:unpatched_heads:req');
    }

    render() {
        return (
          <div className="patch-page">
            <table className="patch-table">
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
                        return (<PatchTableItem
                          key={index + 1}
                          index={index + 1}
                          headName={channel.headName}
                          channelName={channel.channelName}
                        />);
                    } else {
                        return <PatchTableItem key={index + 1} index={index + 1} />;
                    }
                })
              }
              </tbody>
            </table>
          </div>
        );
    }
}

Patch.propTypes = {
    channels: React.PropTypes.array,
    unpatchedHeads: React.PropTypes.array
};

// Map patched head's channels to array and get unpatched heads
// for patching
function mapStateToProps(state) {
    const patchedHeads = state.getIn(['patch', 'patched_heads']).toJS();
    var arr = new Array(512).fill(null); // ES6 feature
    patchedHeads.forEach(head => {

        const startIndex = head.start_channel - 1;
        for (var i = startIndex; i < (startIndex + head.channels.length); i++) {
            arr[i] = {
                headName: head.name,
                channelName: head.channels[i - startIndex]
            };
        }
    });
    return {
        channels: arr,
        unpatchedHeads: state.getIn(['patch', 'unpatched_heads']).toJS()
    };
}

export default connect(mapStateToProps)(Patch);
