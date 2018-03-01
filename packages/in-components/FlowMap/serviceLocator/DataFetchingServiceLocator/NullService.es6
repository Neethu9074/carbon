import { nothing } from 'in-services/fixedStreams';

function noop() {}

const nullService = {
  getIncomingDataForNodeId: () => nothing,
  getOutgoingDataForNodeId: () => nothing,
  fetchOutgoingDataForChildId: () => nothing,
  fetchIncomingDataForChildId: () => nothing,
  fetchMetricsForNodeId: () => nothing,
  fetchMetricsForChildId: () => nothing,
  fetchNodeById: () => nothing,
  getIconTypeForNodeId: noop,
  dispose: noop
};
export default function createNullService() {
  return nullService;
}
