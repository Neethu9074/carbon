import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import createUniverseRenderer from 'in-components/graphView/components/universeRenderer';
import {getClassName} from 'in-services/react';

import './Universe.less';


const block = 'in-universe';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'Universe',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    className: rpt.string
  },

  componentDidMount() {
    this.renderer = createUniverseRenderer({
      container: this.refs.container,
      canvas: this.refs.canvas
    });
  },

  componentWillUnmount() {
    this.renderer.dispose();
  },

  render() {
    return (
      <div className={getClassName(this, block)}
           ref='container'>
        <canvas ref='canvas'
                className={block + '__canvas'} />
      </div>
    );
  }
});
