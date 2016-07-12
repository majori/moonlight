import React from 'react';
import { capitalizeFirstLetter } from '../../utils/utils';

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
                    this.props.headName ?
                    capitalizeFirstLetter(this.props.headName) :
                    '-'
                }
            </td>
            <td className="channel-name">
                {
                    this.props.channelName ?
                    capitalizeFirstLetter(this.props.channelName) :
                    '-'
                }
            </td>
          </tr>
        );
    }
}

PatchTableItem.propTypes = {
    index: React.PropTypes.number,
    headName: React.PropTypes.string,
    channelName: React.PropTypes.string
};

export default PatchTableItem;
