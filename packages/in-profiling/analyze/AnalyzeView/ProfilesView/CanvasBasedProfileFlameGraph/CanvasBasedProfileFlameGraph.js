import React from 'react';

import HighlightingHandler from 'in-profiling/analyze/AnalyzeView/ProfilesView/CanvasBasedProfileFlameGraph/HighlightingHandler';
import strechData from 'in-profiling/analyze/AnalyzeView/ProfilesView/CanvasBasedProfileFlameGraph/strechData';
import render from 'in-profiling/analyze/AnalyzeView/ProfilesView/CanvasBasedProfileFlameGraph/renderer';
import mapData from 'in-profiling/analyze/AnalyzeView/ProfilesView/CanvasBasedProfileFlameGraph/data';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { joinClassNames } from 'in-services/util/classnames';
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
      selectedNode: false,
      scale: createScale(),
      selfTimeHighlighted: false
    };

    shouldComponentUpdate(nextProps, nextState) {
      if (
        this.props.profile.__uid !== nextProps.profile.__uid ||
        this.props.width !== nextProps.width ||
        this.state.selfTimeHighlighted !== nextState.selfTimeHighlighted ||
        this.props.query !== nextProps.query
      ) {
        this.calculateData(nextProps, nextState);
      }

      // reset selected node on resize
      if (this.props.width !== nextProps.width && nextState.selectedNode) {
        this.setState({ selectedNode: null });
      }

      if (this.props.width !== nextProps.width || this.state.selectedNode !== nextState.selectedNode) {
        this.calculateScale(nextProps, nextState);
      }

      return true;
    }

    componentDidUpdate(prevProps, prevState) {
      if ((this.state.data && this.state.data !== prevState.data) || this.state.scale !== prevState.scale) {
        strechData(this.state.data, this.state.scale);
        render(this.canvas, this.state.data, this.state.selfTimeHighlighted, this.state.selectedNode);
      }
    }

    calculateData = ({ width, profile, query }, { selfTimeHighlighted }) => {
      if (width <= 0) {
        return;
      }
      this.setState({ data: mapData(profile, width, query, selfTimeHighlighted) });
    };

    calculateScale = ({ width }, { selectedNode }) => {
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
      const selfTimeHighlighted = this.state.selfTimeHighlighted;
      return (
        <div className={locals.wrapper}>
          <Button
            className={joinClassNames(locals.button, locals.controlButton)}
            kind={selfTimeHighlighted ? 'primaryv2' : 'secondary'}
            onClick={() => {
              this.setState({ selfTimeHighlighted: !selfTimeHighlighted });
            }}
          >
            Highlight self CPU
          </Button>
          {this.state.selectedNode ? (
            <Button
              className={joinClassNames(locals.button, locals.resetButton)}
              size="compact"
              kind="primaryv2"
              onClick={() => {
                this.setState({ selectedNode: null });
              }}
            >
              Reset
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
                selectedNode={this.state.selectedNode}
                onNodeSelected={selectedNode => this.setState({ selectedNode })}
              />
            )}
          </div>
        </div>
      );
    }
  }
);
