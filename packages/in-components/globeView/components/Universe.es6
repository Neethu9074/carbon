import rpt from 'prop-types';
import React from 'react';

import createUniverseRenderer from 'in-components/globeView/components/universeRenderer';
import { isWebGLSupported } from 'in-map/services/webGL';
import { getClassName } from 'in-services/util/react';

import './Universe.less';

const block = 'in-globe-view-universe';

export default class extends React.PureComponent {
  static displayName = 'GlobeUniverse';

  static propTypes = {
    className: rpt.string
  };

  componentDidMount() {
    if (isWebGLSupported(this.canvas)) {
      this.renderer = createUniverseRenderer({
        container: this.container,
        canvas: this.canvas
      });
    }
  }

  componentWillUnmount() {
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  render() {
    return (
      <div className={getClassName(this, block)} ref={container => (this.container = container)}>
        <canvas ref={canvas => (this.canvas = canvas)} className={block + '__canvas'} />
      </div>
    );
  }
}
