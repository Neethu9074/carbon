import React from 'react';

import {isWebVRSupported, createNoWebVRDialog} from 'in-map/services/webVR';
import {showHelp, closeHelpIfOpen} from 'in-stores/navigation/navigation';
import {isWebGLSupported, isContextLost$} from 'in-map/services/webGL';
import {setActiveDialog} from 'in-components/DialogPresenter/store';
import {canvas$, setCanvas, clear} from 'in-map/stores/indexStore';
import SceneComponent from 'in-map/components/SceneComponent';
import {getWebGLCanvasContext} from 'in-map/services/webGL';
import {webVRIsActive} from 'in-map/stores/webVRStore';
import {getIn} from 'in-services/settings';
import connectTo from 'in-hoc/connectTo';
import 'in-map/Map.less';


const rpt = React.PropTypes;
const block = 'in-map';

export default connectTo({
  antialias: getIn(['map', 'antialias']),
  isContextLost: isContextLost$,
  canvas: canvas$
},
React.createClass({

  displayName: 'Map',

  propTypes: {
    isContextLost: rpt.bool,
    antialias: rpt.string,
    webVRMode: rpt.bool,
    canvas: rpt.object
  },

  componentDidMount() {
    const canvas = this.mainCanvas;
    this.checkDialogs();
    if (isWebGLSupported() && !this.props.isContextLost) {
      setCanvas(canvas);
    }
  },

  componentDidUpdate(prevProps) {
    if (prevProps.canvas !== this.props.canvas) {
      this.checkDialogs();
    }
  },

  componentWillUnmount() {
    clear();
  },

  render() {
    const antialias = this.props.antialias;
    const webVRMode = this.props.webVRMode;
    const _canvas = this.props.canvas;

    let className = block;
    if (webVRMode) {
      className += ` ${block}--webvr`;
    }

    // set global VR flag
    webVRIsActive(webVRMode ? true : false);

    return (
      <div className={className}>
        <canvas className={`${block}__canvas`}
                ref={canvas => {
                  this.mainCanvas = canvas;
                  this.webGlContext = getWebGLCanvasContext(canvas);
                }} />
        {(_canvas && antialias)
          ? <SceneComponent canvas={_canvas}
                            webGlContext={this.webGlContext}
                            antialias={antialias} />
          : null
        }
      </div>
    );
  },

  checkDialogs() {
    if (!isWebGLSupported() || this.props.isContextLost) {
      showHelp('webglNotSupported');
    } else if (!this.webGlContext) {
      showHelp('webglNotInitialized');
    } else {
      closeHelpIfOpen('webglNotSupported');
      closeHelpIfOpen('webglNotInitialized');
    }

    if (this.props.webVRMode && !isWebVRSupported()) {
      // diasable this for a while to allow working with this branch without any VR headset connected
      setActiveDialog(createNoWebVRDialog());
    }
  }
}));
