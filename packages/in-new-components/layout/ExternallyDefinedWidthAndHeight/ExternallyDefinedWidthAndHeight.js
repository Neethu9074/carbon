/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { debouncedResize$ } from 'in-services/browser';

import locals from './ExternallyDefinedWidthAndHeight.mless';

export default class ExternallyDefinedWidthAndHeight extends React.Component {
  constructor() {
    super();
    this.state = {
      width: null,
      height: null
    };
  }

  setDomNode = domNode => {
    this.domNode = domNode;
    this.onResize();
  };

  onResize = () => {
    if (!this.domNode) {
      return;
    }

    const width = this.domNode.clientWidth;
    const height = this.domNode.clientHeight;
    if (width !== this.state.width || height !== this.state.height) {
      this.setState({
        width,
        height
      });
    }
  };

  componentDidMount() {
    this.subscription = debouncedResize$.subscribe(this.onResize);
    this.onResize();
  }

  componentDidUpdate() {
    this.onResize();
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.dispose();
    }
  }

  render() {
    return (
      <div className={locals.outterWrapper} ref={this.setDomNode}>
        {this.state.width && <div className={locals.innerWrapper}>{this.props.children(this.state)}</div>}
      </div>
    );
  }
}
