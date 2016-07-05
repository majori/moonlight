import io from 'socket.io-client';
import cfg from '../../config';

export const socket = io.connect('http://'+cfg.httpAddress+':'+cfg.ioPort);

var storeHandle = null;

export function setStoreToApi(store) {
    storeHandle = store;
}

socket.on('patch:universe:res', (universe) => {
    storeHandle.dispatch(updateUniverse(universe));
})

export function updateUniverse(universe) {
    return {
        type: 'UPDATE_UNIVERSE',
        universe: universe
    }
}
