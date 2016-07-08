import RoEmitter from 'roemitter';


export let eventBus = new RoEmitter('global event bus');

export function clearEmitter() {
  if (eventBus) {
    eventBus.dispose();
  }

  eventBus = new RoEmitter('global event bus');
}
