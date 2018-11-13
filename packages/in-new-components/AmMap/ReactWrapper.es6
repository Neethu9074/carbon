import React from 'react';

import locals from './ReactWrapper.mless';

export default class AmMapReactWrapper extends React.Component {
  componentDidMount() {
    this.mounted = true;

    this.map = this.props.onDidMount({
      containerElement: this.ele
    });
  }

  componentWillUnmount() {
    this.unmounted = true;

    if (this.map) {
      this.map.destroy();
      this.map = null;
    }

    if (this.props.onWillUnmount) {
      this.props.onWillUnmount();
    }
  }

  render() {
    return <div ref={ele => (this.ele = ele)} style={{ height: this.props.height }} className={locals.wrapper} />;
  }
}
