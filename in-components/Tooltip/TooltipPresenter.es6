import ReactDOM from 'react-dom';
import React from 'react';

import * as tooltipStore from 'in-services/stores/tooltip';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import './TooltipPresenter.less';


const block = 'in-tooltip-presenter';
const horizontalMargin = 20;
const verticalMargin = 10;

export default connectTo({
    activeTooltip: tooltipStore.activeTooltip.nextFrame()
  }, React.createClass({

  displayName: 'TooltipPresenter',

  propTypes: {
    activeTooltip: tooltipStore.TooltipShape
  },

  componentDidUpdate() {
    const activeTooltip = this.props.activeTooltip;
    // nothing to do if there is no active tooltip
    if (!activeTooltip) {
      return;
    }

    const tooltipElement = ReactDOM.findDOMNode(this);
    const align = this.resolveAutoAlignment();

    // add the CSS classes for arrow alignment
    tooltipElement.className = '';
    tooltipElement.classList.add(block);
    tooltipElement.classList.add(`${block}__${align.horizontal}-${align.vertical}`);

    if (activeTooltip.focusedElement) {
      this.positionFocusedElement(align, tooltipElement, activeTooltip.focusedElement);
    } else if (activeTooltip.focusedPoint) {
      tooltipElement.style.left = toPx(activeTooltip.focusedPoint.x);
      tooltipElement.style.top = toPx(activeTooltip.focusedPoint.y);
    } else {
      throw new Error('Not possible to show tooltip without any focused element.');
    }
  },

  positionFocusedElement(align, tooltipElement, focusedElement) {
    const focusedElementBox = focusedElement.getBoundingClientRect();
    this.positionFocusedElementHorizontally(align, tooltipElement, focusedElement, focusedElementBox);
    this.positionFocusedElementVertically(align, tooltipElement, focusedElement, focusedElementBox);
  },

  positionFocusedElementHorizontally(align, tooltipElement, focusedElement, focusedElementBox) {
    let left;
    let right;

    if (align.horizontal === 'left') {
      right = window.innerWidth - focusedElementBox.left;
      if (align.vertical !== 'middle') {
        right -= horizontalMargin;
      } else {
        right += horizontalMargin;
      }
    } else {
      left = focusedElementBox.left + focusedElementBox.width - horizontalMargin;
    }

    this.set(tooltipElement, 'left', left);
    this.set(tooltipElement, 'right', right);
  },

  positionFocusedElementVertically(align, tooltipElement, focusedElement, focusedElementBox) {
    let top;
    let bottom;

    if (align.vertical === 'bottom') {
      top = focusedElementBox.top + focusedElementBox.height - verticalMargin;
    } else if (align.vertical === 'top') {
      bottom = window.innerHeight - focusedElementBox.top + verticalMargin;
    } else if (align.vertical === 'middle') {
      top = focusedElementBox.top + focusedElementBox.height / 2;
    }

    this.set(tooltipElement, 'top', top);
    this.set(tooltipElement, 'bottom', bottom);
  },

  set(ele, prop, value) {
    if (value == null) {
      ele.style[prop] = null;
    } else {
      ele.style[prop] = toPx(value);
    }
  },

  resolveAutoAlignment() {
    const activeTooltip = this.props.activeTooltip;

    const align = {
      horizontal: activeTooltip.align.horizontal,
      vertical: activeTooltip.align.vertical
    };

    const boundingRect = activeTooltip.focusedElement.getBoundingClientRect();
    if (align.horizontal === 'auto') {
      align.horizontal = (boundingRect.left < window.innerWidth / 2) ? 'right' : 'left';
    }

    if (align.vertical === 'auto') {
      align.vertical = (boundingRect.top < window.innerHeight / 2) ? 'bottom' : 'top';
    }

    return align;
  },

  render() {
    if (!this.props.activeTooltip) {
      return null;
    }

    return <div>{this.props.activeTooltip.content}</div>;
  }
}));
