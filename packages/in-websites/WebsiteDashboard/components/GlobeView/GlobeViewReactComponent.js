/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import GlobeView from 'in-websites/WebsiteDashboard/components/GlobeView/components/GlobeView';
import { isWebGLSupported } from 'in-map/services/webGL';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './GlobeView.mless';

export default class GlobeViewReactComponent extends React.Component {
  static displayName = 'GlobeViewReactComponent';

  componentDidMount() {
    if (isWebGLSupported(this.canvas)) {
      this.globeView = new GlobeView({
        overlay: this.overlay,
        container: this.container,
        canvas: this.canvas,
        getData$: this.props.getData$,
        getValue: this.props.getValue
      });
      this.globeView.updateData(this.props);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.customHeight !== this.props.customHeight && this.globeView) {
      this.globeView.resize();
    }

    if (prevProps.timeConfig !== this.props.timeConfig || prevProps.tagFilters !== this.props.tagFilters) {
      if (this.globeView) {
        this.globeView.updateData(this.props);
      }
    }
  }

  componentWillUnmount() {
    if (this.globeView) {
      this.globeView.dispose();
    }
  }

  render() {
    return (
      <div
        className={locals.wrapper}
        ref={container => (this.container = container)}
        style={{ height: this.props.customHeight }}
      >
        <Title title={t('in-websites:websiteDashboard.components.globeViewTitle')} />

        <canvas ref={canvas => (this.canvas = canvas)} className={locals.canvas} />

        <div className={locals.overlay} ref={overlay => (this.overlay = overlay)} />
      </div>
    );
  }
}
