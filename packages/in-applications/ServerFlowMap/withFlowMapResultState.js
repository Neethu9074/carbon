/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create } from '@instana/observables';
import React, { Component } from 'react';

import FlowMapState from 'in-applications/ServerFlowMap/FlowMapState';
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
  return class StatefulFlowMapComponent extends Component {
    static displayName = getDisplayName(ComposedComponent, 'withFlowMapResultState');

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
      const collapseRight = this.props.collapseRight;
      const collapseLeft = this.props.collapseLeft;
      if (rootNodeData) {
        const result = this.flowMapState.addRootNode(rootNodeData);
        if (rootNodeData.endpoint) {
          if (!collapseRight) {
            this.expandChildRight(result.nodeId, result.id);
          }
          if (!collapseLeft) {
            this.expandChildLeft(result.nodeId, result.id);
          }
        } else {
          if (!collapseRight) {
            this.expandNodeRight(result.id);
          }
          if (!collapseLeft) {
            this.expandNodeLeft(result.id);
          }
        }
      }
      this.queueNextFlowMapState(this.flowMapState);
    }

    componentWillUnmount() {
      this.disposeSubscriptions();
    }

    loadMore = ({ nodeId, childId, direction, cursor }) => {
      if (childId) {
        if (direction === 'incoming') {
          this.expandChildLeft(nodeId, childId, cursor + 1);
        } else {
          this.expandChildRight(nodeId, childId, cursor + 1);
        }
      } else {
        if (direction === 'incoming') {
          this.expandNodeLeft(nodeId, cursor + 1);
        } else {
          this.expandNodeRight(nodeId, cursor + 1);
        }
      }
    };

    expandNodeLeft = (nodeId, cursor) => {
      this.createFlowNodesSubscription(nodeId, 'incoming', this.getIncomingFlowNodes$, cursor);
    };

    expandNodeRight = (nodeId, cursor) => {
      this.createFlowNodesSubscription(nodeId, 'outgoing', this.getOutgoingFlowNodes$, cursor);
    };

    expandChildLeft = (nodeId, childId, cursor) => {
      this.openFlowNodesSubscriptionForEndpoint(nodeId, childId, 'incoming', this.getIncomingFlowNodes$, cursor);
    };

    expandChildRight = (nodeId, childId, cursor) => {
      this.openFlowNodesSubscriptionForEndpoint(nodeId, childId, 'outgoing', this.getOutgoingFlowNodes$, cursor);
    };

    createFlowNodesSubscription = (serviceId, direction, callback, cursor) => {
      this.setupSubscriptionIfAbsent(
        serviceId,
        serviceId,
        null,
        direction,
        servicePath => callback(serviceId, servicePath, cursor),
        this.flowMapState.processServiceResult.bind(this.flowMapState)
      );
    };

    openFlowNodesSubscriptionForEndpoint = (serviceId, endpointId, direction, callback, cursor) => {
      const path = this.flowMapState.pathFinder.findChild(serviceId, endpointId, direction);
      this.setupSubscriptionIfAbsent(
        `${serviceId}__${endpointId}`,
        serviceId,
        endpointId,
        direction,
        () => callback(endpointId, path, cursor),
        this.flowMapState.processEndpointResult.bind(this.flowMapState)
      );
    };

    getIncomingFlowNodes$ = (id, path, page) => {
      return this.getFlowNodes$(id, path, page, 'INCOMING');
    };

    getOutgoingFlowNodes$ = (id, path, page) => {
      return this.getFlowNodes$(id, path, page, 'OUTGOING');
    };

    getFlowNodes$ = (nodeId, path, page, direction) => {
      return this.props.getFlowNodes({
        metrics,
        filter: {
          application: this.props.applicationId,
          service: this.props.serviceId,
          endpoint: this.props.endpointId,
          timeConfig: this.props.timeConfig
        },
        traversal: {
          maxDepth: 1
        },
        path,
        direction,
        pagination: {
          page: page || 1,
          pageSize: 10
        }
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
      return (
        <ComposedComponent
          expandNodeLeft={this.expandNodeLeft}
          expandNodeRight={this.expandNodeRight}
          expandChildLeft={this.expandChildLeft}
          expandChildRight={this.expandChildRight}
          loadMore={this.loadMore}
          {...this.props}
          {...this.state}
        />
      );
    }
  };
};
