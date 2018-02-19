function noop() {}

const nullService = {
  set: noop,
  remove: noop,
  update: noop,
  dispose: noop
};
export default function createNullService() {
  return nullService;
}
