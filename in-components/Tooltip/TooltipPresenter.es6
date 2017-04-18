import ReactDOM from 'react-dom';
import React from 'react';

import TooltipCalculator from 'in-components/Tooltip/TooltipCalculator';
import { activeTooltip, TooltipShape } from 'in-services/stores/tooltip';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import './TooltipPresenter.less';

const block = 'in-tooltip-presenter';

export default connectTo(
  {
    _activeTooltip: activeTooltip.nextFrame()
  },
  class extends React.Component {
    static displayName = 'TooltipPresenter';

    static propTypes = {
      _activeTooltip: TooltipShape
    };

    componentDidUpdate() {
      const _activeTooltip = this.props._activeTooltip;
      // nothing to do if there is no active tooltip
      if (!_activeTooltip) {
        return;
      }

      const tooltipElement = ReactDOM.findDOMNode(this);
      const align = this.props._activeTooltip.align;

      // add the CSS classes for arrow alignment
      tooltipElement.className = '';
      tooltipElement.classList.add(block);

      if (_activeTooltip.focusedElement) {
        this.positionFocusedElement(align, tooltipElement, _activeTooltip.focusedElement);
      } else if (_activeTooltip.focusedPoint) {
        tooltipElement.style.left = toPx(_activeTooltip.focusedPoint.x);
        tooltipElement.style.top = toPx(_activeTooltip.focusedPoint.y);
        tooltipElement.classList.add(`${block}__${align}`);
      } else {
        throw new Error('Not possible to show tooltip without any focused element.');
      }
    }

    positionFocusedElement = (align, tooltipElement, focusedElement) => {
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
      tooltip.align = align;
      const result = TooltipCalculator.calculate(bounds, tooltip, reference);
      this.set(tooltipElement, 'left', result.left);
      this.set(tooltipElement, 'top', result.top);
      this.set(tooltipElement, 'right', result.right !== null ? window.innerWidth - result.right : null);
      this.set(tooltipElement, 'bottom', result.bottom !== null ? window.innerHeight - result.bottom : null);
      tooltipElement.classList.add(`${block}__${tooltip.align}`);
    };

    set = (ele, prop, value) => {
      if (value == null) {
        ele.style[prop] = null;
      } else {
        ele.style[prop] = toPx(value);
      }
    };

    render() {
      const tooltip = this.props._activeTooltip;
      if (!tooltip) {
        return null;
      }

      return (
        <div>
          {tooltip.content}
        </div>
      );
    }
  }
);
