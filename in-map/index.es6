import React from 'react';

import SceneComponent from 'in-map/components/SceneComponent';
import {canvas$, setCanvas} from 'in-map/stores/indexStore';
import connectTo from 'in-hoc/connectTo';
import 'in-map/index.less';


const block = 'in-new-map';

export default connectTo({
  canvas: canvas$
},
React.createClass({

  propTypes: {
    canvas: React.PropTypes.object
  },

  componentDidMount() {
    setCanvas(this.refs.mainCanvas);
  },

  render() {
    const canvas = this.props.canvas;

    return (
      <div className={block}>
        <canvas ref='mainCanvas'/>
        {canvas
          ? <SceneComponent canvas={canvas} />
          : null
        }
      </div>
    );
  }
}));
