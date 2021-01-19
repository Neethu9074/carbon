/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
function noop() {}

const nullService = {
  remove: noop,
  update: noop,
  dispose: noop
};
export default function createNullService() {
  return nullService;
}
