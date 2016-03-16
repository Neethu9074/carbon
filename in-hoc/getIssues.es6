import React from 'react';

import {getIssuesById} from 'in-services/issueTracker';


export default function getIssues(ComposedComponent) {
  return React.createClass({

    displayName: 'getIssues hoc for ' + ComposedComponent.displayName,

    propTypes: {
      snapshotId: React.PropTypes.string.isRequired
    },

    getInitialState() {
      return {
        issues: null
      };
    },

    componentWillMount() {
      this.subscribe(this.props.snapshotId);
    },

    componentWillReceiveProps(nextProps) {
      if (this.props.snapshotId !== nextProps.snapshotId) {
        this.subscribe(nextProps.snapshotId);
      }
    },

    subscribe(snapshotId) {
      if (this.subscription) {
        this.subscription.dispose();
        this.subscription = null;
      }

      // reset state
      this.setState(this.getInitialState());

      if (snapshotId) {
        this.subscription = getIssuesById(snapshotId).subscribe(allIssues => {
          const issues = allIssues && allIssues.size > 0 ?
            allIssues.toArray().sort((i1, i2) =>
              i1.getIn(['problem', 'severity']) > i2.getIn(['problem', 'severity'])) :
            null;
          this.setState({
            issues
          });
        });
      }
    },

    componentWillUnmount() {
      if (this.subscription) {
        this.subscription.dispose();
        this.subscription = null;
      }
    },

    render() {
      return (
        <ComposedComponent {...this.props}
                           {...this.state} />
      );
    }
  });
}
