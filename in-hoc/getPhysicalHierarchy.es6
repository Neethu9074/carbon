import React from 'react';

import { getPhysicalHierarchy as loadPhysicalHierarchy } from 'in-stores/snapshot';
import { emptyList } from 'in-services/fixedImmutables';

export default function getPhysicalHierarchy(ComposedComponent) {
  return React.createClass({
    displayName: 'getPhysicalHierarchy hoc for ' + ComposedComponent.displayName,

    getInitialState() {
      return {
        physicalHierarchy: emptyList
      };
    },

    componentWillMount() {
      this.subscribe(this.props);
    },

    componentWillReceiveProps(nextProps) {
      this.subscribe(nextProps);
    },

    subscribe(props) {
      if (props.snapshotId == null) {
        this.unsubscribe();
        this.setState({
          physicalHierarchy: emptyList
        });
      } else if (props.snapshotId !== this.subscriptionForSnapshotId) {
        this.unsubscribe();
        this.subscriptionForSnapshotId = props.snapshotId;
        this.setState({
          physicalHierarchy: emptyList
        });
        this.subscription = loadPhysicalHierarchy(props.snapshotId)
          .startWith(emptyList)
          .subscribe(physicalHierarchy => this.setState({ physicalHierarchy }));
      }
    },

    unsubscribe() {
      if (this.subscription) {
        this.subscription.dispose();
        this.subscription = null;
      }
      this.subscriptionForSnapshotId = null;
    },

    componentWillUnmount() {
      this.unsubscribe();
    },

    render() {
      return <ComposedComponent {...this.props} {...this.state} />;
    }
  });
}
