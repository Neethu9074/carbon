import ReactDOM from 'react-dom';
import React from 'react';

import * as tooltipStore from 'in-services/stores/tooltip';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import './TooltipPresenter.less';
import TooltipCalculator from './TooltipCalculator';


const block = 'in-tooltip-presenter';

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
    const align = {
      horizontal: 'auto',
      vertical: 'auto'
    };

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
    const tooltipElementBox = tooltipElement.getBoundingClientRect();
    const bounds = {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight
    };
    const tooltip = {
      left: tooltipElementBox.left,
      top: tooltipElementBox.top,
      right: tooltipElementBox.left + tooltipElementBox.width,
      bottom: tooltipElementBox.top + tooltipElementBox.height
    };
    const reference = {
      left: focusedElementBox.left,
      top: focusedElementBox.top,
      right: focusedElementBox.left + focusedElementBox.width,
      bottom: focusedElementBox.top + focusedElementBox.height
    };
    tooltip.align = this.translateAlignment(align);

    const result = TooltipCalculator.calculate(bounds, tooltip, reference);
    this.set(tooltipElement, 'left', result.left);
    this.set(tooltipElement, 'top', result.top);
    this.set(tooltipElement, 'right', result.right);
    this.set(tooltipElement, 'bottom', result.bottom);
  },

  set(ele, prop, value) {
    if (value == null) {
      ele.style[prop] = null;
    } else {
      ele.style[prop] = toPx(value);
    }
  },

  translateAlignment(align) {
    if (align.horizontal === 'left') {
      return 'leftMiddle';
    }
    if (align.horizontal === 'right') {
      return 'rightMiddle';
    }
    if (align.vertical === 'top') {
      return 'topMiddle';
    }
    if (align.vertical === 'bottom') {
      return 'bottomMiddle';
    }
    return 'bottomMiddle';
  },

  render() {
    if (!this.props.activeTooltip) {
      return null;
    }

    return <div>{this.props.activeTooltip.content}</div>;
  }
}));
