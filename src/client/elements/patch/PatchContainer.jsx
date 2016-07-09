import React from 'react';
import { connect } from 'react-redux';

import { socket } from '../../services/api';

import PatchTable from './PatchTable';
import PatchForm from './PatchForm';

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

    handleFormSubmit(formValues) {
      console.log(formValues);
    }

    render() {
        // Map all patched head channels to channel array
        let channels = new Array(512).fill(null); // ES6 feature
        this.props.patchedHeads.forEach(head => {

            const startIndex = head.start_channel - 1;
            for (var i = startIndex; i < (startIndex + head.channels.length); i++) {
                channels[i] = {
                    headName: head.name,
                    channelName: head.channels[i - startIndex]
                };
            }
        });

        return (
          <div className="patch-page">
            <div className="patch-form">
              <PatchForm
                heads={this.props.unpatchedHeads}
                onSubmit={this.handleFormSubmit}
              />
            </div>
            <div className="patch-table-wrapper">
              <PatchTable channels={channels} />
            </div>
          </div>
        );
    }
}

Patch.propTypes = {
    patchedHeads: React.PropTypes.array,
    unpatchedHeads: React.PropTypes.array
};

function mapStateToProps(state) {
    const patchStateTree = state.app.get('patch');
    return {
        patchedHeads: patchStateTree.get('patchedHeads').toJS(),
        unpatchedHeads: patchStateTree.get('unpatchedHeads').toJS()
    };
}

export default connect(mapStateToProps)(Patch);

