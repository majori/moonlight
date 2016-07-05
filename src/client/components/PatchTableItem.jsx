import React from 'react';

class PatchTableItem extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'PatchTableItem';
    }

    render() {
        return (
            <tr className="patch-table-item">
              <td className="channel-number">1</td>
              <td className="channel-data">No head</td>
            </tr>
        );
    }
}

export default PatchTableItem;
