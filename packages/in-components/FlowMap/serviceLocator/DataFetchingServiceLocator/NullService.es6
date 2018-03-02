import { nothing } from 'in-services/fixedStreams';

function noop() {}

const nullService = {
  getIncomingFlowNodes$: () => nothing,
  getOutgoingFlowNodes$: () => nothing,
  getMetrics$: () => nothing,
  getNode$: () => nothing,
  getIconTypeForNodeId: noop,
  dispose: noop
};
export default function createNullService() {
  return nullService;
}
