import io from 'socket.io-client';
import cfg from '../../config';

export const socket = io.connect('http://'+cfg.httpAddress+':'+cfg.ioPort);

var storeHandle = null;

export function setStoreToApi(store) {
    storeHandle = store;
}

socket.on('connect', () => {
    socket.emit('universe:req');
});

socket.on('universe:res', (universe) => {
    storeHandle.dispatch(updateUniverse(universe));
})

socket.on('patch:heads:res', heads => {
    storeHandle.dispatch(setPatchedHeads(heads));
});

export function updateUniverse(universe) {
    return {
        type: 'UPDATE_UNIVERSE',
        universe
    }
}

export function setPatchedHeads(heads) {
    return {
        type: 'SET_PATCHED_HEADS',
        heads
    }
}
