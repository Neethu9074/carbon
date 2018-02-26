function noop() {}

const nullService = {
  remove: noop,
  update: noop,
  dispose: noop
};
export default function createNullService() {
  return nullService;
}
