import React from 'react';

class PatchTableItem extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'PatchTableItem';
    }

    render() {
        return (
            <tr className="patch-table-item">
              <td className="channel-number">{this.props.index}</td>
              <td className="head-name">
                {
                (this.props.headName) ?
                    this.props.headName :
                    '-'
                }
              </td>
              <td className="channel-name">
                {
                (this.props.channelName) ?
                    this.props.channelName :
                    '-'
                }
              </td>
            </tr>
        );
    }
}

export default PatchTableItem;
