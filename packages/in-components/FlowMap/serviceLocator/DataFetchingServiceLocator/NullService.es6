import { nothing } from 'in-services/fixedStreams';

function noop() {}

const nullService = {
  getIncomingDataForNodeId: () => nothing,
  getOutgoingDataForNodeId: () => nothing,
  fetchMetricsForNodeId: () => nothing,
  dispose: noop
};
export default function createNullService() {
  return nullService;
}
