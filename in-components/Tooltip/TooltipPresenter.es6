import React from 'react/addons';

import * as tooltipStore from 'in-services/stores/tooltip';
import toPx from 'in-services/converters/toPx';
import {applyTransform} from 'in-services/util/dom';

import enhance from '../hoc/enhance';

import './TooltipPresenter.less';

const block = 'in-tooltip-presenter';
const horizontalMargin = 10;

const TooltipPresenter = React.createClass({

  propTypes: {
    activeTooltip: tooltipStore.TooltipShape
  },

  statics: {
    createObservables() {
      return {
        activeTooltip: tooltipStore.activeTooltip.nextFrame()
      };
    }
  },

  componentDidUpdate() {
    const activeTooltip = this.props.activeTooltip;

    // nothing to do if there is no active tooltip
    if (!activeTooltip) {
      return;
    }

    const tooltipElement = React.findDOMNode(this);
    // each box has width, height, top, left properties
    const tooltipBox = tooltipElement.getBoundingClientRect();

    const focusedElement = activeTooltip.focusedElement;
    const focusedElementBox = focusedElement.getBoundingClientRect();

    const x = activeTooltip.align === 'left' ?
      focusedElementBox.left - tooltipBox.width - horizontalMargin :
      focusedElementBox.right + horizontalMargin;

    const y = focusedElementBox.top + focusedElementBox.height / 2 - tooltipBox.height / 2;

    applyTransform(tooltipElement, 'translate(' + toPx(x) + ',' + toPx(y) + ')');
  },

  render() {
    const activeTooltip = this.props.activeTooltip;

    if (!activeTooltip) {
      return null;
    }

    return (
      <div className={block + ' ' + block + '__' + activeTooltip.align}>
        {activeTooltip.content}
      </div>
    );
  }
});

export default enhance(TooltipPresenter);
