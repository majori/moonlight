import { List, Map, fromJS } from 'immutable';

export const defaultState = fromJS({
    universe: [],
    patch: Map({
        patched_heads: List(),
        unpatched_heads: List()
    })
});

export default function(state = defaultState, action) {
    switch (action.type) {

        case 'SET_UNIVERSE':
            return state.set('universe', fromJS(action.universe));

        case 'SET_PATCHED_HEADS':
            return state.setIn(['patch', 'patched_heads'], fromJS(action.heads));

        case 'SET_UNPATCHED_HEADS':
            return state.setIn(['patch', 'unpatched_heads'], fromJS(action.heads));

        default:
            return state;
    }
}
