import React from 'react';

import {isWebVRSupported/* , createNoWebVRDialog*/} from 'in-map/services/webVR';
// import {setActiveDialog} from 'in-components/DialogPresenter/store';
import {canvas$, setCanvas, clear} from 'in-map/stores/indexStore';
import SceneComponent from 'in-map/components/SceneComponent';
import {isWebGLSupported} from 'in-map/services/webGL';
import {showHelp} from 'in-stores/navigation';
import {getIn} from 'in-services/settings';
import connectTo from 'in-hoc/connectTo';
import 'in-map/index.less';


const rpt = React.PropTypes;
const block = 'in-new-map';

export default connectTo({
  antialias: getIn(['map', 'antialias']),
  canvas: canvas$
},
React.createClass({

  propTypes: {
    antialias: rpt.string,
    webVRMode: rpt.bool,
    canvas: rpt.object
  },

  componentDidMount() {
    if (!isWebGLSupported(this.refs.mainCanvas)) {
      showHelp(203889331);
    } else if (this.props.webVRMode && !isWebVRSupported()) {
      // diasable this for a while to allow working with this branch without any VR headset connected
      // setActiveDialog(createNoWebVRDialog());
      setCanvas(this.refs.mainCanvas);
    } else {
      setCanvas(this.refs.mainCanvas);
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

    return (
      <div className={className}>
        <canvas ref='mainCanvas'
                className={`${block}__canvas`}/>
        {(_canvas && antialias)
          ? <SceneComponent canvas={_canvas}
                            webVRMode={webVRMode}
                            antialias={antialias}/>
          : null
        }
      </div>
    );
  }
}));
