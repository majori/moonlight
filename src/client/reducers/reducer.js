import {List, Map, fromJS} from 'immutable';

export const defaultState = fromJS({
    universe: List()
});

function updateUniverse(state, universe) {
    return state.set('universe', fromJS(universe));
}

function setState(state, newState) {
  return state.merge(newState);
}

export default function(state = Map(), action) {

    switch (action.type) {
        case 'UPDATE_UNIVERSE':
            return updateUniverse(state, action.universe);
        default:
            return state;
  }
}
