import RoEmitter from 'roemitter';


export let eventBus;

export function createEventBus() {
  if (eventBus) {
    eventBus.dispose();
  }

  eventBus = new RoEmitter('global event bus');
}
