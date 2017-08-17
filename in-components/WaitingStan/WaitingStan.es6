import React from 'react';

import createScene from 'in-components/WaitingStan/components/Scene';
import { getWebGLCanvasContext } from 'in-map/services/webGL';
import { isWebGLSupported } from 'in-map/services/webGL';

import './WaitingStan.less';

const block = 'in-waiting-stan';

export default class WaitingStan extends React.Component {
  static displayName = 'Map';

  componentDidMount() {
    if (isWebGLSupported() && this.webGlContext) {
      console.log('setup');
      this.scene = createScene(this.canvas, this.webGlContext);
    }
  }

  componentWillUnmount() {
    if (this.scene) {
      this.scene.dispose();
    }
  }

  render() {
    return (
      <div className={block}>
        <canvas
          className={`${block}__canvas`}
          ref={canvas => {
            this.mainCanvas = canvas;
            this.webGlContext = getWebGLCanvasContext(canvas);
          }}
        />
      </div>
    );
  }
}
