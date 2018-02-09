function noop() {}

const nullService = {
  init: noop,
  getDataForNode: noop,
  disposeDataForNode: noop,
  dispose: noop
};
export default function createNullService() {
  return nullService;
}
