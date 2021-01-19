/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import RoEmitter from '@instana/roemitter';

export function createSceneObject(id = 'id1') {
  const eventEmitter = new RoEmitter();
  return {
    id,
    eventEmitter,
    dispose: () => {
      eventEmitter.dispose();
    }
  };
}
