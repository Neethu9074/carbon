import rpt from 'prop-types';
import React from 'react';

import TooltipFrame from 'in-components/Tooltips/Frame';
import { onMove } from 'in-services/reactiveMouseEvents';
import { applyTransform } from 'in-services/util/dom';
import { theme } from 'in-services/theme';

const OFFSET = 15;
const DEFAULT_STYLE = {
  position: 'absolute',
  left: 0,
  top: 0
};

export default function Tooltip(ComposedComponent) {
  return React.createClass({
    displayName: 'Tooltip',

    propTypes: {
      canvas: rpt.object.isRequired
    },

    componentDidMount() {
      this.positionSubscription = onMove(this.props.canvas, event => {
        const tooltip = this.tooltip;
        if (tooltip) {
          const x = event.clientX + OFFSET;
          const y = event.clientY - theme.header.height - OFFSET;
          applyTransform(tooltip, `translate3d(${x}px,${y}px,0)`);
        }
      });

      // set starting position into the nimbus, to avoid that tootltips are hosted without a position to set
      applyTransform(this.tooltip, `translate3d(${-1000}px,${0}px,0)`);
    },

    componentWillUnmount() {
      if (this.positionSubscription) {
        this.positionSubscription.dispose();
        this.positionSubscription = null;
      }
    },

    render() {
      return (
        <div ref={tooltip => this.tooltip = tooltip} style={DEFAULT_STYLE}>
          <TooltipFrame>
            <ComposedComponent {...this.props} {...this.state} />
          </TooltipFrame>
        </div>
      );
    }
  });
}
