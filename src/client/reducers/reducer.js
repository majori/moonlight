import { List, Map, fromJS } from 'immutable';

export const defaultState = Map({
    universe: List(),
    patch: Map({
        patchedHeads: List(),
        unpatchedHeads: List()
    })
});

export default function(state = defaultState, action) {
    switch (action.type) {

        case 'SET_UNIVERSE':
            return state.set('universe', fromJS(action.universe));

        case 'SET_PATCHED_HEADS':
            return state.setIn(['patch', 'patchedHeads'], fromJS(action.heads));

        case 'SET_UNPATCHED_HEADS':
            return state.setIn(['patch', 'unpatchedHeads'], fromJS(action.heads));

        default:
            return state;
    }
}
