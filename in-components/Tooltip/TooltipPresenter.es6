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
    this.translateAlign();
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

    const x = this.getX(activeTooltip.align, focusedElementBox, tooltipBox);
    const y = focusedElementBox.top + focusedElementBox.height / 2 - tooltipBox.height / 2;

    applyTransform(tooltipElement, 'translate(' + toPx(x) + ',' + toPx(y) + ')');
  },

  translateAlign() {
    const activeTT = this.props.activeTooltip;

    if (activeTT && activeTT.align === 'auto') {
      activeTT.align = (activeTT.focusedElement.getBoundingClientRect().left < window.innerWidth / 2) ?
        'right' : 'left';
    }
  },

  getX(align, focusedElementBox, tooltipBox) {
    if (align === 'left') {
      return focusedElementBox.left - tooltipBox.width - horizontalMargin;
    } else if (align === 'right') {
      return focusedElementBox.right + horizontalMargin;
    }
  },

  render() {
    const activeTooltip = this.props.activeTooltip;
    this.translateAlign();

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
