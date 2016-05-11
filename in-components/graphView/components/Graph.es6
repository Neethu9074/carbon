import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactDOM from 'react-dom';
import React from 'react';

import Sigma from './sigma.require.js';
import './Graph.less';

// We need to keep a local copy of sigma until the following PR is merged
// and released:
// https://github.com/jacomyal/sigma.js/pull/653

const block = 'in-graph';

export default React.createClass({
  displayName: 'Graph',

  mixins: [PureRenderMixin],

  propTypes: {
    // TODO Define props
    // foo: rpt.string.isRequired
  },

  componentDidMount() {
    const domNode = ReactDOM.findDOMNode(this);

   /* eslint-disable */
    let i,
        s,
        N = 100,
        E = 500,
        g = {
          nodes: [],
          edges: []
        };

    // Generate a random graph:
    for (i = 0; i < N; i++)
      g.nodes.push({
        id: 'n' + i,
        label: 'Node ' + i,
        x: Math.random(),
        y: Math.random(),
        size: Math.random(),
        color: '#666'
      });

    for (i = 0; i < E; i++)
      g.edges.push({
        id: 'e' + i,
        source: 'n' + (Math.random() * N | 0),
        target: 'n' + (Math.random() * N | 0),
        size: Math.random(),
        color: '#ccc'
      });
    /* eslint-enable */


    // Instantiate sigma:
    this.sigma = new Sigma({
      graph: g,
      type: 'canvas',
      container: domNode
    });
  },

  componentWillUnmount() {
    if (this.sigma) {
      this.sigma.kill();
      this.sigma = null;
    }
  },

  render() {
    return (
      <div className={block} />
    );
  }
});
