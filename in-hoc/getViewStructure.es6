import React from 'react';

import {viewStructure} from 'in-stores/view';


export default function getViewStructure(ComposedComponent) {
  return React.createClass({
    displayName: 'getViewStructure hoc for ' + ComposedComponent.displayName,

    getInitialState() {
      return {
        snapshot: null
      };
    },

    componentWillMount() {
      this.subscribe();
    },

    subscribe() {
      if (this.subscription) {
        this.subscription.dispose();
        this.subscription = null;
      }

      // reset state
      this.setState(this.getInitialState());

      this.subscription = viewStructure.subscribe(view => {
        this.setState({
          viewStructure: view
        });
      });
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
