import React from 'react';

export default class SideEffectOnPropertyChange extends React.PureComponent {
  componentDidUpdate() {
    this.props.sideEffect();
  }

  render() {
    return null;
  }
}
