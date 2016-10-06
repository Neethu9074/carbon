import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import createBackgroundRenderer from 'in-components/globeView/components/backgroundRenderer';
import createUniverseRenderer from 'in-components/globeView/components/universeRenderer';
import {isWebGLSupported} from 'in-map/services/webGL';
import {getClassName} from 'in-services/react';

import './Universe.less';


const block = 'in-globe-view-universe';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'GlobeUniverse',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    className: rpt.string
  },

  componentDidMount() {
    if (isWebGLSupported(this.refs.canvas)) {
      this.renderer = createUniverseRenderer({
        container: this.refs.container,
        canvas: this.refs.canvas
      });
      this.backgroundRenderer = createBackgroundRenderer({
        container: this.refs.container,
        canvas: this.refs.canvas2D
      });
    }
  },

  componentWillUnmount() {
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.backgroundRenderer) {
      this.backgroundRenderer.dispose();
    }
  },

  render() {
    return (
      <div className={getClassName(this, block)}
           ref='container'>
        <canvas ref='canvas2D'
                className={block + '__canvas'} />
        <canvas ref='canvas'
                className={block + '__canvas'} />
      </div>
    );
  }
});
