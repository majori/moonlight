import {List, Map, fromJS} from 'immutable';

export const defaultState = fromJS({
    universe: [],
    patch: Map({
        heads: List()
    })
});

function updateUniverse(state, universe) {
    return state.set('universe', fromJS(universe));
}

function setPatchedHeads(state, heads) {
    return state.patch.set('heads', fromJS(heads));
}

export default function(state = Map(), action) {

    switch (action.type) {
        case 'UPDATE_UNIVERSE':
            return updateUniverse(state, action.universe);
        case 'SET_PATCHED_HEADS':
            return setPatchedHeads(state, action.heads);
        default:
            return state;
    }
}
