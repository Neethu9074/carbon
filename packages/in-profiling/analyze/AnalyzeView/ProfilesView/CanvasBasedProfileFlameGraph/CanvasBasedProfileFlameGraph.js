/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import HighlightingHandler from 'in-profiling/analyze/AnalyzeView/ProfilesView/CanvasBasedProfileFlameGraph/HighlightingHandler';
import strechData from 'in-profiling/analyze/AnalyzeView/ProfilesView/CanvasBasedProfileFlameGraph/strechData';
import render from 'in-profiling/analyze/AnalyzeView/ProfilesView/CanvasBasedProfileFlameGraph/renderer';
import mapData from 'in-profiling/analyze/AnalyzeView/ProfilesView/CanvasBasedProfileFlameGraph/data';
import getElementDimensions from 'in-hoc/getElementDimensions';
import Button from 'in-new-components/Button';
import createScale from 'in-services/scale';

import locals from './CanvasBasedProfileFlameGraph.mless';

export default getElementDimensions(
  class CanvasBasedProfileFlameGraph extends React.Component {
    static displayName = 'CanvasBasedProfileFlameGraph';

    constructor(props) {
      super(props);
    }

    state = {
      data: null,
      scale: createScale()
    };

    shouldComponentUpdate(nextProps) {
      if (
        this.props.profile.__uid !== nextProps.profile.__uid ||
        this.props.width !== nextProps.width ||
        this.props.selfTimeHighlighted !== nextProps.selfTimeHighlighted ||
        this.props.threshold !== nextProps.threshold ||
        this.props.query !== nextProps.query
      ) {
        this.calculateData(nextProps);
      }

      // reset selected node on resize
      if (this.props.width && nextProps.width && this.props.width !== nextProps.width && nextProps.selectedNode) {
        this.props.setSelectedNode(null);
      }

      if (this.props.width !== nextProps.width || this.props.selectedNode !== nextProps.selectedNode) {
        this.calculateScale(nextProps);
      }

      return true;
    }

    componentDidUpdate(prevProps, prevState) {
      if ((this.state.data && this.state.data !== prevState.data) || this.state.scale !== prevState.scale) {
        strechData(this.state.data, this.state.scale);
        render(
          this.canvas,
          this.state.data,
          this.props.selfTimeHighlighted,
          this.props.selectedNode,
          this.props.threshold
        );
      }
    }

    calculateData = ({ width, profile, query, selfTimeHighlighted }) => {
      if (width <= 0) {
        return;
      }
      this.setState({ data: mapData(profile, width, query, selfTimeHighlighted) });
    };

    calculateScale = ({ width, selectedNode }) => {
      const scale = createScale();
      scale.setRangeFrom(0);
      scale.setRangeTo(width);
      scale.setDomainFrom(0);
      scale.setDomainTo(width);
      scale.scaleFactor = 1;
      if (selectedNode) {
        const scaleFactor = width / selectedNode.width;
        const leftHandSide = selectedNode.x;
        const fromShifted = -leftHandSide;
        const toShifted = width - leftHandSide;
        scale.setDomainFrom(fromShifted * scaleFactor);
        scale.setDomainTo(toShifted * scaleFactor);
        scale.scaleFactor = scaleFactor;
      }

      this.setState({ scale });
    };

    render() {
      const selectedNode = this.props.selectedNode;

      return (
        <div className={locals.wrapper}>
          {selectedNode ? (
            <Button
              className={locals.resetButton}
              size="compact"
              kind="primaryv2"
              onClick={() => this.props.setSelectedNode(null)}
            >
              {t('in-profiling:reset')}
            </Button>
          ) : (
            <div className={locals.resetButtonPlaceholder} />
          )}
          <div className={locals.canvasWrapper}>
            <canvas className={locals.canvas} ref={canvas => (this.canvas = canvas)} />
            {this.canvas && (
              <HighlightingHandler
                canvas={this.canvas}
                data={this.state.data}
                scale={this.state.scale}
                selectedNode={selectedNode}
                threshold={this.props.threshold}
                onNodeSelected={this.props.setSelectedNode}
              />
            )}
          </div>
        </div>
      );
    }
  }
);
