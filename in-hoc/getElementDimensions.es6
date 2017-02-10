/* eslint-disable react/no-find-dom-node */

import ReactDOM from 'react-dom';
import React from 'react';

import {debouncedResize$} from 'in-services/browser';

export default function getElementDimensions(ComposedComponent) {
  return  React.createClass({
    displayName: 'ElementDimensionHoc',

    getInitialState() {
      return {
        height: null
      };
    },

    componentDidMount() {
      this.domNode = ReactDOM.findDOMNode(this);
      this.calculateDimensions();
      this.subscription = debouncedResize$
        .subscribe(this.calculateDimensions);
    },

    calculateDimensions() {
      this.setState({
        height: this.domNode.clientHeight,
        width: this.domNode.clientWidth
      });
    },

    componentWillUnmount() {
      this.subscription.dispose();
    },

    render() {
      return (
        <ComposedComponent {...this.props}
                           height={this.state.height}
                           width={this.state.width} />
      );
    }
  });
}
