import React from 'react';

import PatchTableItem from './PatchTableItem';

export default class PatchTable extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'PatchTable';
    }
    render() {
        return (
          <table className="patch-table">
            <thead className="patch-table-head">
              <tr>
                <th>Number</th>
                <th>Head name</th>
                <th>Channel name</th>
              </tr>
            </thead>
            <tbody className="patch-table-body">
            {
              this.props.channels.map((channel, index) => {
                  index++; // Add one so that array starts from 1
                  if (channel) {
                      return (<PatchTableItem
                        key={index}
                        index={index}
                        headName={channel.headName}
                        channelName={channel.channelName}
                      />);
                  } else {
                      return <PatchTableItem key={index} index={index} />;
                  }
              })
            }
            </tbody>
          </table>
        );
    }
}

PatchTable.propTypes = {
    channels: React.PropTypes.array,
};
