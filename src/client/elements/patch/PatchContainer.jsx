import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { groupBy, map } from 'lodash';

import { socket } from '../../services/api';

import PatchTableItem from './PatchTableItem';

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
        var headsByManuf = groupBy(this.props.unpatchedHeads, (head) => {
            return (head.manufacturer) ? head.manufacturer : '-';
        });

        return (
          <div className="patch-page">
            <div className="patch-form">
              <form>
                <fieldset>
                  <div className="form__group">
                    <label>Valitse valaisin: </label>
                    <select>
                      {
                          map(headsByManuf, (heads, manuf) => {
                              return (<optgroup label={manuf}>
                              {
                                heads.map(head => {
                                  return <option value={head.id}>{getHeadDisplayName(head)}</option>;
                                })
                              }
                              </optgroup>);
                          })
                      }
                    </select>
                  </div>
                  <div className="form__group">
                    <label>Nimi:</label>
                    <input type="text" placeholder="LedPar_3" {...name}/>
                  </div>

                  <div className="form__controls">
                    <button type="submit">Tallenna</button>
                    <button>Peruuta</button>
                  </div>
                  </fieldset>
              </form>
            </div>
            <div className="patch-table-wrapper">
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
            </div>
          </div>
        );
    }
}

Patch.propTypes = {
    channels: React.PropTypes.array,
    unpatchedHeads: React.PropTypes.array
};

function getHeadDisplayName(head) {
    return (head.manufacturer) ?
        head.manufacturer + ' ' + head.model :
        head.model;
}

// Map patched head's channels to array and get unpatched heads
// for patching
function mapStateToProps(state) {
    const patchedHeads = state.app.getIn(['patch', 'patchedHeads']).toJS();
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
        unpatchedHeads: state.app.getIn(['patch', 'unpatchedHeads']).toJS()
    };
}

export default connect(mapStateToProps)(Patch);

