/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

export default class SideEffectOnPropertyChange extends React.PureComponent {
  componentDidUpdate() {
    this.props.sideEffect();
  }

  render() {
    return null;
  }
}
