function noop() {}

const nullService = {
  getIdFromData: data => JSON.stringify(data),
  fetchIncomingDataForNodeId: noop,
  fetchOutgoingDataForNodeId: noop,
  dispose: noop
};
export default function createNullService() {
  return nullService;
}
