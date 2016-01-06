// We want to reduce the overhead of channels on the network. Example: A metric
// subscription would need to include the hostId, pluginId, steadyId, metric
// name and possibly other pieces of information in order to route messages.
// This is way too much overhead. We want to route messages based on a single
// numeric value. This is what these IDs are for. We include a single ID in
// server responses to reduce the overhead.
let idCounter = 0;

export function getNewDataId() {
  return idCounter++;
}
