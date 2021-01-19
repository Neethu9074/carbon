/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { on } from '@instana/observables';
import React from 'react';

import Tooltip from 'in-components/Tooltip';

import locals from './HighlightingHandler.mless';

export default class HighlightingHandler extends React.Component {
  static displayName = 'HighlightingHandler';

  state = { highlightedNode: null };

  componentDidMount() {
    this.setupSubscriptions();
  }

  componentWillUnmount() {
    this.disposeSubscriptions();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.selectedNode !== prevProps.selectedNode ||
      this.props.scale !== prevProps.scale ||
      this.props.threshold !== prevProps.threshold
    ) {
      this.resetHighlighting();
    }
  }

  resetHighlighting() {
    this.setState({ highlightedNode: null });
  }

  onMouseMove = e => {
    const y = Math.max(0, e.offsetY);
    const heightPerNode = 16;
    const layerIndex = Math.floor(y / heightPerNode);
    const layer = this.props.data.layers.get(layerIndex);
    if (!layer) {
      return;
    }

    this.setState({ highlightedNode: this.getHoveredNode(layer, e.offsetX) });
  };

  getHoveredNode(layer, mouseXPosition) {
    for (let i = 0; i < layer.length; i++) {
      const node = layer[i];
      const nodeX = node.s_x;
      const nodeWidth = node.s_width;
      if (node.percent > this.props.threshold && mouseXPosition >= nodeX && mouseXPosition < nodeX + nodeWidth) {
        return node;
      }
    }
  }

  setupSubscriptions() {
    if (!this.props.canvas) {
      return;
    }

    this.onMouseMoveSubscription = on(this.props.canvas, 'mousemove')
      .throttle(25)
      .subscribe(this.onMouseMove.bind(this));
  }

  disposeSubscriptions = () => {
    if (this.onMouseMoveSubscription) {
      this.onMouseMoveSubscription.dispose();
      this.onMouseMoveSubscription = null;
    }
  };

  render() {
    const node = this.state.highlightedNode;
    if (!node) {
      return null;
    }
    return (
      <Tooltip themeStyle="light" content={`${node.name} (${((node.percent * 100) | 1) / 100}%)`} align="topMiddle">
        <div
          className={locals.highlightedNode}
          style={{
            top: node.y,
            left: node.s_x,
            width: node.s_width,
            height: node.height
          }}
          onClick={() => this.props.onNodeSelected(node)}
        />
      </Tooltip>
    );
  }
}
