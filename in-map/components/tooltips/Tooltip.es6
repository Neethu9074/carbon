import React from 'react';

import TooltipFrame from 'in-components/Tooltips/Frame';
import {onMove} from 'in-services/reactiveMouseEvents';
import {theme} from 'in-services/theme';


const rpt = React.PropTypes;
const OFFSET = 15;

export default function Tooltip(ComposedComponent) {
  return React.createClass({

    displayName: 'Tooltip',

    propTypes: {
      canvas: rpt.object.isRequired,
      entity: rpt.any.isRequired
    },

    getInitialState() {
      return {
        x: -Number.MAX_VALUE,
        y: 0
      };
    },

    componentDidMount() {
      this.positionSubscription = onMove(this.props.canvas, event => {
        this.setState({
          x: event.clientX + OFFSET,
          y: event.clientY - theme.header.height - OFFSET
        });
      });
    },

    componentWillUnmount() {
      this.positionSubscription.dispose();
      this.positionSubscription = null;
    },

    render() {
      const style = {
        position: 'absolute',
        top: this.state.y + 'px',
        left: this.state.x + 'px'
      };

      return (
        <div style={style}>
          <TooltipFrame>
            <ComposedComponent {...this.props}
                               {...this.state} />
          </TooltipFrame>
        </div>
      );
    }
  });
}
