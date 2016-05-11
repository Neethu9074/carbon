/* eslint-disable */

import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactDOM from 'react-dom';
import React from 'react';

import createGraphSubscription from 'in-services/subscription/graph';
import {focusedMoment$} from 'in-stores/timeline';

import Sigma from './sigma.require.js';
window.sigma = Sigma;
import './sigma.layout.forceatlas-worker.js';
import './sigma.layout.forceatlas-supervisor.js';
import './sigma.plugins.animate.js';

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

    const graph = {
      nodes: [],
      edges: []
    };

    this.sigma = new Sigma({
      graph,
      settings: {
        drawLabels: false,
        drawEdgeLabels: false
      },
      renderer: {
        type: 'webgl',
        container: domNode
      }
    });

    let layoutExecuting = false;

    // Maps node id to node object. Allows us to retain node objects
    // and thus to reuse their last used position.
    const nodeIndex = {};

    this.subscription = focusedMoment$
      .flatMap(focusedMoment => {
        Object.keys(nodeIndex).forEach(snapshotId => {
          nodeIndex[snapshotId].edgeCount = 0;
        });

        // Clear previously retrieved edges and nodes as the following
        // update will retrieve a full update.
        graph.nodes = [];
        graph.edges = [];
        // this.sigma.refresh();

        return createGraphSubscription(focusedMoment);
      })
      .subscribe(edgeUpdates => {
        for (let i = 0, len = edgeUpdates.length; i < len; i++) {
          const edgeUpdate = edgeUpdates[i];

          if (edgeUpdate.modificationType === 'ADD') {
            if (!nodeIndex[edgeUpdate.from]) {
              nodeIndex[edgeUpdate.from] = {
                id: edgeUpdate.from,
                label: edgeUpdate.from,
                x: Math.random(),
                y: Math.random(),
                size: 1,
                color: '#666',
                edgeCount: 0
              };
            }

            if (nodeIndex[edgeUpdate.from].edgeCount === 0) {
              nodeIndex[edgeUpdate.from].edgeCount = 1;
              this.sigma.graph.addNode(nodeIndex[edgeUpdate.from]);
            }

            if (!nodeIndex[edgeUpdate.to]) {
              nodeIndex[edgeUpdate.to] = {
                id: edgeUpdate.to,
                label: edgeUpdate.to,
                x: Math.random(),
                y: Math.random(),
                size: 1,
                color: '#666',
                edgeCount: 0
              };
            }

            if (nodeIndex[edgeUpdate.to].edgeCount === 0) {
              nodeIndex[edgeUpdate.to].edgeCount = 1;
              this.sigma.graph.addNode(nodeIndex[edgeUpdate.to]);
            }

            this.sigma.graph.addEdge({
              id: edgeUpdate.id,
              source: edgeUpdate.from,
              target: edgeUpdate.to,
              size: Math.random(),
              color: '#ccc'
            });
          } else {
            if (nodeIndex[edgeUpdate.from]) {
              nodeIndex[edgeUpdate.from].edgeCount--;

              if (nodeIndex[edgeUpdate.from].edgeCount === 0) {
                this.sigma.graph.dropNode(edgeUpdate.from);
              }
            }

            if (nodeIndex[edgeUpdate.to]) {
              nodeIndex[edgeUpdate.to].edgeCount--;

              if (nodeIndex[edgeUpdate.to].edgeCount === 0) {
                this.sigma.graph.dropNode(edgeUpdate.to);
              }
            }

            this.sigma.graph.dropEdge(edgeUpdate.id);
          }
        }

        // console.log(graph);
        this.sigma.refresh();
        // this.sigma.startNoverlap();

        if (!layoutExecuting) {
          this.sigma.startForceAtlas2({worker: false, barnesHutOptimize: false});
          layoutExecuting = true;
        }
      });

    // let i,
    //     s,
    //     N = 100,
    //     E = 500,
    //     g = {
    //       nodes: [],
    //       edges: []
    //     };
    //
    // // Generate a random graph:
    // for (i = 0; i < N; i++)
    //   g.nodes.push({
    //     id: 'n' + i,
    //     label: 'Node ' + i,
    //     x: Math.random(),
    //     y: Math.random(),
    //     size: Math.random(),
    //     color: '#666'
    //   });
    //
    // for (i = 0; i < E; i++)
    //   g.edges.push({
    //     id: 'e' + i,
    //     source: 'n' + (Math.random() * N | 0),
    //     target: 'n' + (Math.random() * N | 0),
    //     size: Math.random(),
    //     color: '#ccc'
    //   });
    /* eslint-enable */
  },

  componentWillUnmount() {
    if (this.sigma) {
      this.sigma.kill();
    }
    if (this.subscription) {
      this.subscription.dispose();
    }
  },

  render() {
    return (
      <div className={block} />
    );
  }
});
