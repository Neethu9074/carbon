import { createFactory, Component } from 'react';
import { create } from 'reactive-observables';

import FlowMapState from 'in-components/ServerFlowMap/FlowMapState';
import { getDisplayName } from 'in-hoc/internal/getDisplayName';

const metrics = {
  callsAgg: {
    metric: 'calls',
    aggregation: 'SUM'
  },
  latencyAgg: {
    metric: 'latency',
    aggregation: 'MEAN'
  },
  errorsAgg: {
    metric: 'errors',
    aggregation: 'MEAN'
  }
};

export default () => ComposedComponent => {
  const factory = createFactory(ComposedComponent);

  return class StatefulFlowMapComponent extends Component {
    static displayName = getDisplayName('withFlowMapResultState', ComposedComponent);

    constructor(props) {
      super(props);

      // a diff on the whole flow map state is pretty expensive. Since other properties can trigger a subcomponent.componentDidUpdate,
      // a simple counter is provided, so the subcomponent can check, if something changed on the flowMapState
      this.flowMapStateVersion = 0;

      // a simple stream to batch expensive state updates
      this.flowMapStateQueue$ = create();

      this.flowMapState = new FlowMapState();
      this.subscriptions = new Map();

      this.flowMapStateQueueSubscription = this.flowMapStateQueue$.debounce(50).subscribe(nextFlowMapState => {
        // copy current flowmap to state. state is only read from the ComposedComponent
        this.setState({
          flowMapStateVersion: ++this.flowMapStateVersion,
          flowMapState: nextFlowMapState
        });
      });
    }

    queueNextFlowMapState = nextFlowMapState => {
      this.flowMapStateQueue$.emit(nextFlowMapState);
    };

    componentDidMount() {
      const rootNodeData = this.props.rootNodeData;
      if (rootNodeData) {
        const result = this.flowMapState.addRootNode(rootNodeData);
        if (rootNodeData.endpoint) {
          this.expandChildRight(result.nodeId, result.id);
          this.expandChildLeft(result.nodeId, result.id);
        } else {
          this.expandNodeRight(result.id);
          this.expandNodeLeft(result.id);
        }
      }
      this.queueNextFlowMapState(this.flowMapState);
    }

    componentWillUnmount() {
      this.disposeSubscriptions();
    }

    expandNodeLeft = nodeId => {
      this.createFlowNodesSubscription(nodeId, 'incoming', this.getIncomingFlowNodes$);
    };

    expandNodeRight = nodeId => {
      this.createFlowNodesSubscription(nodeId, 'outgoing', this.getOutgoingFlowNodes$);
    };

    expandChildLeft = (nodeId, childId) => {
      this.openFlowNodesSubscriptionForEndpoint(nodeId, childId, 'incoming', this.getIncomingFlowNodes$);
    };

    expandChildRight = (nodeId, childId) => {
      this.openFlowNodesSubscriptionForEndpoint(nodeId, childId, 'outgoing', this.getOutgoingFlowNodes$);
    };

    openFlowNodesSubscriptionForEndpoint = (serviceId, endpointId, direction, callback) => {
      const path = this.flowMapState.pathFinder.findChild(serviceId, endpointId, direction);
      this.setupSubscriptionIfAbsent(
        `${serviceId}__${endpointId}`,
        serviceId,
        endpointId,
        direction,
        () => callback(endpointId, path),
        this.flowMapState.processEndpointResult.bind(this.flowMapState)
      );
    };

    createFlowNodesSubscription = (serviceId, direction, callback) => {
      this.setupSubscriptionIfAbsent(
        serviceId,
        serviceId,
        null,
        direction,
        servicePath => callback(serviceId, servicePath),
        this.flowMapState.processServiceResult.bind(this.flowMapState)
      );
    };

    getIncomingFlowNodes$ = (id, path) => {
      return this.getFlowNodes$(id, path, 'INCOMING');
    };

    getOutgoingFlowNodes$ = (id, path) => {
      return this.getFlowNodes$(id, path, 'OUTGOING');
    };

    getFlowNodes$ = (nodeId, path, direction) => {
      return this.props.getFlowNodes({
        metrics,
        filter: {
          label: '',
          timeframe: this.props.timeframe
        },
        traversal: {
          maxDepth: 1
        },
        path,
        direction
      });
    };

    setupSubscriptionIfAbsent = (subscriptionId, nodeId, endpointId, direction, fetchData, processResult) => {
      if (!this.containsSubscription(subscriptionId, direction)) {
        const servicePath = this.flowMapState.pathFinder.find(nodeId, direction).map(node => node.__originalId);

        const directionSubscriptions = this.subscriptions.get(subscriptionId) || {};
        directionSubscriptions[direction] = fetchData(servicePath).subscribe(result => {
          processResult(nodeId, endpointId, result, direction, servicePath);
          this.queueNextFlowMapState(this.flowMapState);
          this.disposeSubscriptionIfNoUpdateFromResultIsExpected(subscriptionId, result, direction);
        });
        this.subscriptions.set(subscriptionId, directionSubscriptions);
      }
    };

    disposeSubscriptionIfNoUpdateFromResultIsExpected(subscriptionId, result, direction) {
      const hasErrors = result.errors.length > 0;
      if (result.data || hasErrors) {
        this.disposeSubscription(subscriptionId, direction);
      }
    }

    containsSubscription = (id, direction) => {
      const directionSubscriptions = this.subscriptions.get(id);
      return directionSubscriptions && directionSubscriptions[direction] ? true : false;
    };

    disposeSubscription = (subscriptionId, direction) => {
      const directionSubscriptions = this.subscriptions.get(subscriptionId) || {};
      if (directionSubscriptions[direction]) {
        directionSubscriptions[direction].dispose();
        delete directionSubscriptions[direction];
        this.subscriptions.set(subscriptionId, directionSubscriptions);
      }
    };

    disposeSubscriptions = () => {
      this.flowMapStateQueueSubscription.dispose();
      this.flowMapStateQueueSubscription = null;

      const subscriptions = this.subscriptions.keys();
      for (const subscriptionId of subscriptions) {
        this.disposeSubscription(subscriptionId, 'incoming');
        this.disposeSubscription(subscriptionId, 'outgoing');
      }
      this.subscriptions.clear();
    };

    render() {
      return factory({
        expandNodeLeft: this.expandNodeLeft,
        expandNodeRight: this.expandNodeRight,
        expandChildLeft: this.expandChildLeft,
        expandChildRight: this.expandChildRight,
        ...this.props,
        ...this.state
      });
    }
  };
};
