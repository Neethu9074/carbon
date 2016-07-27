import React from 'react';

import {canvas$, setCanvas} from 'in-map/stores/indexStore';
import SceneObject from 'in-map/components/SceneObject';
import Scene from 'in-map/sceneObjects/Scene';
import connectTo from 'in-hoc/connectTo';
import 'in-map/index.less';


const block = 'in-new-map';

export default connectTo({
  canvas: canvas$
}, React.createClass({

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
            ? <SceneObject InstanceType={Scene}
                           params={{canvas}} />
            : null
          }
        </div>
      );
    }
  })
);
