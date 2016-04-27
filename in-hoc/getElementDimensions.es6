import ReactDOM from 'react-dom';
import * as ro from 'reactive-observables';
import React from 'react';

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
      this.subscription = ro.on(window, 'resize')
        .debounce(300)
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
        <ComposedComponent {...this.props} height={this.state.height} width={this.state.width} />
      );
    }
  });
}
