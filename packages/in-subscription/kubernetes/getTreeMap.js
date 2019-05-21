import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getTreeMap',
  memoizeFor: args => {
    const timeConfig = args[0].filter.timeConfig;
    // since the treemap is completely based on the graph, historical data will probably not change
    if (!timeConfig.autoRefresh) {
      return Math.min(1000 * 60 * 5, timeConfig.windowSize);
    } else return 5000;
  },
  disposeSubscriptionOnDocumentHidden: false
});
