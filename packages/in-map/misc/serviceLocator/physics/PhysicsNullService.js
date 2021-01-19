/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
function noop() {}

const physicsNullService = {
  init: noop,
  checkRaycaster: noop,
  addCollisionObject: noop,
  removeCollisionObject: noop,
  updateCollisionObject: noop,
  dispose: noop
};
export default function createNullService() {
  return physicsNullService;
}
