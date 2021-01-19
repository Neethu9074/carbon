/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import rpt from 'prop-types';
import React from 'react';

import createUniverseRenderer from 'in-components/graphView/components/universeRenderer';
import { markAsLoading, markAsFinished } from 'in-components/graphView/graphViewStore';
import { isWebGLSupported } from 'in-map/services/webGL';

import './Universe.less';

const block = 'in-universe';

export default class extends React.PureComponent {
  static displayName = 'Universe';

  static propTypes = {
    className: rpt.string
  };

  componentDidMount() {
    markAsLoading();
    if (isWebGLSupported(this.canvas)) {
      this.renderer = createUniverseRenderer({
        container: this.container,
        canvas: this.canvas
      });
    }
  }

  componentWillUnmount() {
    markAsFinished();
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  render() {
    return (
      <div className={`${block} ${this.props.className || ''}`} ref={container => (this.container = container)}>
        <canvas ref={canvas => (this.canvas = canvas)} className={block + '__canvas'} />
      </div>
    );
  }
}
