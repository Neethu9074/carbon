/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import rpt from 'prop-types';
import React from 'react';

import { onMove } from 'in-services/util/reactiveMouseEvents';
import TooltipFrame from 'in-components/Tooltips/Frame';
import { applyTransform } from 'in-services/util/dom';

const OFFSET = 15;
const DEFAULT_STYLE = {
  position: 'absolute',
  left: 0,
  top: 0
};

export default function Tooltip(ComposedComponent) {
  return class extends React.Component {
    static displayName = 'Message';

    static propTypes = {
      canvas: rpt.object.isRequired
    };

    componentDidMount() {
      this.positionSubscription = onMove(this.props.canvas, event => {
        const tooltip = this.tooltip;
        if (tooltip) {
          const x = event.clientX - OFFSET * 3;
          const y = event.clientY - 154 - OFFSET;
          applyTransform(tooltip, `translate3d(${x}px,${y}px,0)`);
        }
      });

      // set starting position into the nimbus, to avoid that tootltips are hosted without a position to set
      applyTransform(this.tooltip, `translate3d(${-1000}px,${0}px,0)`);
      applyTransform(this.tooltip, `translate3d(${-1000}px,${0}px,0)`);
    }

    componentWillUnmount() {
      if (this.positionSubscription) {
        this.positionSubscription.dispose();
        this.positionSubscription = null;
      }
    }

    render() {
      return (
        <div ref={tooltip => (this.tooltip = tooltip)} style={DEFAULT_STYLE}>
          <TooltipFrame>
            <ComposedComponent {...this.props} {...this.state} />
          </TooltipFrame>
        </div>
      );
    }
  };
}
