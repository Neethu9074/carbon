function noop() {}

const nullService = {
  getDataFromResult: data => ({ id: JSON.stringify(data) }),
  fetchIncomingDataForNodeId: noop,
  fetchOutgoingDataForNodeId: noop,
  dispose: noop
};
export default function createNullService() {
  return nullService;
}
