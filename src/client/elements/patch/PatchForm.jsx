import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { groupBy, map } from 'lodash';

import { capitalizeFirstLetter } from '../../utils/utils';

export class PatchForm extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'PatchForm';
    }
    validate(values) {
        const errors = {};
        if (!values.headId) {
            errors.headId = 'Required';
        }
        if (!values.name) {
            errors.name = 'Required';
        }
        // TODO: If name isn't unique
        // TODO: If start channel is already in use
        return errors;
    }

    handleHeadChange() {

    }

    render() {
        const { fields: {
            headId,
            name,
            startChannel,
            currentMode
        }, handleSubmit } = this.props;

        var headSelected = (headId.value !== '') ? true : false;

        // Categorize heads to drop-down menu
        let headsByManuf = groupBy(this.props.heads, (head) => {
            return (head.manufacturer) ? head.manufacturer : '-';
        });

        // TODO: Allow user to choose channel from the PatchTable
        var channels = [];
        for (var i = 1; i <= 512; i++) {
            channels.push(<option key={i} value={i}>{i}</option>);
        }

        // TODO: Remove mode form when changing head
        // If head have modes, make user choose one
        var modeForm = [];
        var showChannels = [];
        if (headSelected) {
            var targetHead = {};
            this.props.heads.forEach((head) => {
                if (head.id == headId.value) {
                    targetHead = head;
                }
            });
            if (targetHead.haveModes) {
                modeForm.push(<label>Choose mode:</label>);
                map(targetHead.modes, (mode, key) => {
                    modeForm.push(<input
                      {...currentMode}
                      type="radio"
                      name="mode"
                      value={key}
                      checked={currentMode.value == key}
                    />);
                    modeForm.push(key);
                });
            } else {
                showChannels = targetHead.channels;
            }

            if (headSelected.haveModes && currentMode && currentMode.value) {
                showChannels = targetHead.modes[currentMode.value];
            }
        }

        // TODO: Suggest name for new head
        // TODO: Validate form

        return (

          <form onSubmit={handleSubmit}>
            <fieldset>
              <div className="form__group">
                <label>Select fixture: </label>
                <select {...headId} onChange={this.handleHeadChange}>
                  {
                      map(headsByManuf, (heads, manuf) => {
                          return (<optgroup key={manuf} label={manuf}>
                          {
                            heads.map(head => {
                                return (
                                  <option
                                    key={head.id}
                                    value={head.id}
                                  >
                                  {
                                    (head.manufacturer) ?
                                    head.manufacturer + ' ' + head.model :
                                    head.model
                                  }
                                  </option>);
                            })
                          }
                          </optgroup>);
                      })
                  }
                </select>
              </div>
              <div className="form__group">
                <label>Name:</label>
                <input type="text" placeholder="LedPar_3" {...name} />
              </div>
              <div className="form__group">
                <label>Start channel:</label>
                <input type="number" placeholder="1-512" {...startChannel} />
              </div>
              <div>
                {modeForm}
              </div>
              <div>
                <table>
                  <tbody>
                    <tr>
                    {
                        showChannels.map((chan) => {
                            return <td>{capitalizeFirstLetter(chan)}</td>;
                        })
                    }
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="form__controls">
                <button type="submit" disabled="">Tallenna</button>
                <button>Peruuta</button>
              </div>
            </fieldset>
          </form>
        );
    }
}

PatchForm.propTypes = {
    fields: PropTypes.object.isRequired,
    heads: PropTypes.array.isRequired,
    handleSubmit: PropTypes.func.isRequired
};

export default reduxForm({
    form: 'patch',
    fields: ['headId', 'name', 'startChannel', 'currentMode'],
    validate: PatchForm.validate
})(PatchForm);
