import React from 'react/addons';

import * as tooltipStore from 'in-services/stores/tooltip';
import {applyTransform} from 'in-services/util/dom';
import toPx from 'in-services/formatters/toPx';

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

    let xy;
    const tooltipElement = React.findDOMNode(this);

    if (activeTooltip.focusedElement) {
      xy = this.getXYFromHtmlElement(tooltipElement);
    } else if (activeTooltip.focusedPoint) {
      xy = activeTooltip.focusedPoint;
    }

    applyTransform(tooltipElement, 'translate(' + toPx(xy.x) + ',' + toPx(xy.y) + ')');
  },

  getXYFromHtmlElement(tooltipElement) {
    this.translateAlign();
    const activeTooltip = this.props.activeTooltip;
    const align = activeTooltip.align;

    // each box has width, height, top, left properties
    const tooltipBox = tooltipElement.getBoundingClientRect();

    const focusedElement = activeTooltip.focusedElement;
    const focusedElementBox = focusedElement.getBoundingClientRect();

    const x = this.getX(align, focusedElementBox, tooltipBox);
    const y = this.getY(align.vertical, focusedElementBox, tooltipBox);

    return {x, y};
  },

  translateAlign() {
    const activeTT = this.props.activeTooltip;

    if (activeTT && activeTT.align) {
      if (activeTT.align.horizontal === 'auto') {
        activeTT.align.horizontal = (activeTT.focusedElement.getBoundingClientRect().left < window.innerWidth / 2) ?
          'right' : 'left';
      }
    }
  },

  getX(align, focusedElementBox, tooltipBox) {
    const horizontal = align.horizontal;
    const vertical = align.vertical;

    // if the tooltip is aligned on top, we need to move the div to the left or right by
    // 40 px so that the :after triangle is pointing directly to the element. what a mess...
    let x = vertical === 'top' ? 40 : 0;

    if (horizontal === 'left') {
      x = focusedElementBox.left - tooltipBox.width - horizontalMargin + x;
    } else if (horizontal === 'right') {
      x = focusedElementBox.right + horizontalMargin - x;
    } else {
      x = focusedElementBox.left + 10;
    }

    return x;
  },

  getY(align, focusedElementBox, tooltipBox) {
    if (align === 'top') {
      return focusedElementBox.top - tooltipBox.height - 6;
    }
    return focusedElementBox.top + focusedElementBox.height / 2 - 10;
  },

  render() {
    const activeTooltip = this.props.activeTooltip;
    let className = block;
    this.translateAlign();


    if (!activeTooltip) {
      return null;
    }

    className += ' ' + block + '__' + activeTooltip.align.horizontal + '-' + activeTooltip.align.vertical;

    return (
      <div className={className}>
        {activeTooltip.content}
      </div>
    );
  }
});

export default enhance(TooltipPresenter);
