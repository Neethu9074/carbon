import React from 'react';

export default class AmMapReactWrapper extends React.Component {
  componentDidMount() {
    this.mounted = true;

    this.props.onDidMount({
      containerElement: this.ele
    });
  }

  componentWillUnmount() {
    this.unmounted = true;

    if (this.props.onWillUnmount) {
      this.props.onWillUnmount();
    }
  }

  render() {
    return <div ref={ele => (this.ele = ele)} />;
  }
}
