function noop() {}

const nullService = {
  fetchIncomingDataForNodeId: noop,
  fetchOutgoingDataForNodeId: noop,
  dispose: noop
};
export default function createNullService() {
  return nullService;
}
