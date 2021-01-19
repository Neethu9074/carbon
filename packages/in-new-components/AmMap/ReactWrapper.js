/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import { emptyObject } from 'in-services/fixedObjects';

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
    return (
      <div
        ref={ele => (this.ele = ele)}
        style={{ height: this.props.height, ...(this.props.style || emptyObject) }}
        className={classNames(locals.wrapper, this.props.className)}
      />
    );
  }
}
