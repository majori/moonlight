import io from 'socket.io-client';
import cfg from '../../config';

export const socket = io.connect('http://' + cfg.httpAddress + ':' + cfg.ioPort);

var storeHandle = null;

export function setStoreToApi(store) {
    storeHandle = store;
}

// Things to do upon connection
socket.on('connect', () => {

});

// ## API calls
//
socket.on('universe:res', (universe) => {
    storeHandle.dispatch({
        type: 'SET_UNIVERSE',
        universe
    });
});

socket.on('patch:patched_heads:res', heads => {
    storeHandle.dispatch({
        type: 'SET_PATCHED_HEADS',
        heads
    });
});

socket.on('patch:unpatched_heads:res', heads => {
    storeHandle.dispatch({
        type: 'SET_UNPATCHED_HEADS',
        heads
    });
});
