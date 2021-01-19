/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { on, create } from '@instana/observables';
import React from 'react';

import { getCoords } from 'in-services/util/dom';

export default class extends React.Component {
  static displayName = 'FullHeightWrapper';

  signal$ = create();

  state = {
    height: null
  };

  componentDidMount() {
    this.resizeSubscription = on(window, 'resize')
      .debounce(100)
      .subscribe(() => this.signal$.emit(true));
    this.refreshSubscription = this.signal$.startWith(true).subscribe(() => this.refresh());
  }

  refresh() {
    this.setState({
      height: window.innerHeight - getCoords(this.wrapper).top
    });
  }

  componentWillUnmount() {
    this.resizeSubscription.dispose();
    this.resizeSubscription = null;

    this.refreshSubscription.dispose();
    this.refreshSubscription = null;
  }

  render() {
    return (
      <div className={this.props.className} style={{ height: this.state.height }} ref={r => (this.wrapper = r)}>
        {this.props.render(this.state.height)}
      </div>
    );
  }
}
