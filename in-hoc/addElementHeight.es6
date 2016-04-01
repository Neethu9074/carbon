import ReactDOM from 'react-dom';
import React from 'react';
import * as ro from 'reactive-observables';

export default function addElementHeight(ComposedComponent) {
  return  React.createClass({
    displayName: 'ElementHeightHoc',

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
        height: this.domNode.clientHeight
      });
    },

    componentWillUnmount() {
      this.subscription.dispose();
    },

    render() {
      return (
        <ComposedComponent {...this.props} height={this.state.height} />
      );
    }
  });
}
