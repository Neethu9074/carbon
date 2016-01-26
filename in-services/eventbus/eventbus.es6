import RoEmitter from 'roemitter';

// This is our application wide event bus
const emitter = new RoEmitter('global event bus');

export default emitter;
