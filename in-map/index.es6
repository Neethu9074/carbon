import React from 'react';

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
    canvas: rpt.object
  },

  componentDidMount() {
    if (!isWebGLSupported(this.refs.mainCanvas)) {
      showHelp(203889331);
    } else {
      setCanvas(this.refs.mainCanvas);
    }
  },

  componentWillUnmount() {
    clear();
  },

  render() {
    const antialias = this.props.antialias;
    const _canvas = this.props.canvas;

    return (
      <div className={block}>
        <canvas ref='mainCanvas'/>
        {(_canvas && antialias)
          ? <SceneComponent canvas={_canvas}
                            antialias={antialias}/>
          : null
        }
      </div>
    );
  }
}));
