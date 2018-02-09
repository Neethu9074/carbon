function noop() {}

const nullService = {
  addOrSet: noop,
  remove: noop,
  update: noop,
  dispose: noop
};
export default function createNullService() {
  return nullService;
}
