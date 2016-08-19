import RoEmitter from 'roemitter';

export function createSceneObject() {
  const eventEmitter = new RoEmitter();
  return {
    id: 'id',
    eventEmitter,
    dispose: () => {
      eventEmitter.dispose();
    }
  };
}
