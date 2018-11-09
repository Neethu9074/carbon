import React from 'react';

import GlobeView from 'in-new-components/GlobeView/components/GlobeView';
import { isWebGLSupported } from 'in-map/services/webGL';
import Title from 'in-components/Title';

import locals from './GlobeView.mless';

export default class GlobeViewReactComponent extends React.Component {
  static displayName = 'GlobeViewReactComponent';

  componentDidMount() {
    if (isWebGLSupported(this.canvas)) {
      this.globeView = new GlobeView({
        overlay: this.overlay,
        container: this.container,
        canvas: this.canvas,
        getData$: this.props.getData$
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.customHeight !== this.props.customHeight && this.globeView) {
      this.globeView.resize();
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
        <Title title="World Globe" />

        <canvas ref={canvas => (this.canvas = canvas)} className={locals.canvas} />

        <div className={locals.overlay} ref={overlay => (this.overlay = overlay)} />
      </div>
    );
  }
}
