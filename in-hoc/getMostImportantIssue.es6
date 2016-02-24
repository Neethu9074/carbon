import React from 'react';

import {getIssuesById} from 'in-services/issueTracker';


export default function getMostImportantIssue(ComposedComponent) {
  return React.createClass({
    displayName: 'getProblems hoc for ' + ComposedComponent.displayName,

    propTypes: {
      snapshotId: React.PropTypes.string.isRequired
    },

    getInitialState() {
      return {
        mostImportantIssue: null
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
        this.subscription = getIssuesById(snapshotId).subscribe(issues => {
          const mostImportantIssue = issues & issues.size > 0 ?
            issues.toArray().sort((i1, i2) =>
              i1.getIn(['problem', 'severity']) > i2.getIn(['problem', 'severity']))[0] :
            null;
          console.log(mostImportantIssue, issues.toJS());
          this.setState({
            mostImportantIssue
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
