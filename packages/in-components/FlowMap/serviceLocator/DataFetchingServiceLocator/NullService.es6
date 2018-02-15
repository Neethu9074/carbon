import { nothing } from 'in-services/fixedStreams';

function noop() {}

const nullService = {
  getDataFromResult: data => ({ id: JSON.stringify(data) }),
  getIncomingDataForNodeId: () => nothing,
  getOutgoingDataForNodeId: () => nothing,
  dispose: noop
};
export default function createNullService() {
  return nullService;
}
