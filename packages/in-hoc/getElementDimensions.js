/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable react/no-find-dom-node */

import ReactDOM from 'react-dom';
import React from 'react';

import { getDisplayName } from 'in-hoc/internal/getDisplayName';
import { debouncedResize$ } from 'in-services/browser';

export default function getElementDimensions(ComposedComponent) {
  return class extends React.Component {
    static displayName = getDisplayName(ComposedComponent, 'ElementDimensionHoc');

    state = {
      height: null
    };

    componentDidMount() {
      this.domNode = ReactDOM.findDOMNode(this);
      this.calculateDimensions();
      this.subscription = debouncedResize$.subscribe(this.calculateDimensions);
    }

    calculateDimensions = () => {
      this.setState({
        height: this.domNode.clientHeight,
        width: this.domNode.clientWidth
      });
    };

    componentWillUnmount() {
      this.subscription.dispose();
    }

    render() {
      return <ComposedComponent {...this.props} height={this.state.height} width={this.state.width} />;
    }
  };
}
