/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { on } from '@instana/observables';
import React from 'react';

import { activeTooltip, TooltipShape } from 'in-services/stores/tooltip';
import TooltipCalculator from 'in-components/Tooltip/TooltipCalculator';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import './TooltipPresenter.less';

const mouseMoveProperty = 'mousePosition';

export default connectTo(
  {
    _activeTooltip: activeTooltip.nextFrame()
  },
  class extends React.Component {
    static displayName = 'TooltipPresenter';

    static propTypes = {
      _activeTooltip: TooltipShape
    };

    subscription = null;

    removeListeners = () => {
      if (this.subscription) {
        this.subscription.dispose();
        this.subscription = null;
      }
    };

    addListeners = domElement => {
      this.removeListeners();
      this.subscription = on(domElement, 'mousemove')
        .throttle(1000 / 60)
        .subscribe(this.onMouseMove);
    };

    componentDidUpdate(prevProps) {
      const isBoundToMousePosition =
        (this.props._activeTooltip && this.props._activeTooltip.align === mouseMoveProperty) ||
        (prevProps._activeTooltip && prevProps._activeTooltip.align === mouseMoveProperty);
      if (isBoundToMousePosition) {
        if (this.props._activeTooltip) {
          this.addListeners(this.props._activeTooltip.focusedElement);
          this.setInitialStyleForMouseMove();
        } else if (prevProps._activeTooltip) {
          this.removeListeners();
        }
      }
      const _activeTooltip = this.props._activeTooltip;

      // nothing to do if there is no active tooltip
      if (!_activeTooltip) {
        return;
      }

      const align = this.props._activeTooltip.align;
      if (align === mouseMoveProperty) {
        return;
      }

      const tooltipElement = this.tooltipElement;
      let block = `in-tooltip-presenter__dark`;
      if (_activeTooltip.themeStyle === 'light') {
        block = `in-tooltip-presenter__light`;
      } else if (_activeTooltip.themeStyle === 'unset') {
        block = `in-tooltip-presenter__unset`;
      }

      // add the CSS classes for arrow alignment
      tooltipElement.className = '';
      tooltipElement.classList.add(block);

      if (_activeTooltip.focusedElement) {
        this.positionFocusedElement(align, tooltipElement, _activeTooltip.focusedElement, block);
      } else if (_activeTooltip.focusedPoint) {
        tooltipElement.style.left = toPx(_activeTooltip.focusedPoint.x);
        tooltipElement.style.top = toPx(_activeTooltip.focusedPoint.y);
        tooltipElement.classList.add(`${block}__${align}`);
      } else {
        throw new Error('Not possible to show tooltip without any focused element.');
      }
    }

    positionFocusedElement = (align, tooltipElement, focusedElement, block) => {
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

      tooltipElement.classList.add(`${block}__${align}`);
    };

    set = (ele, prop, value) => {
      if (value == null) {
        ele.style[prop] = null;
      } else {
        ele.style[prop] = toPx(value);
      }
    };

    onMouseMove = e => {
      const tooltipElement = this.tooltipElement;
      if (!tooltipElement) {
        return;
      }

      const tooltipOffset = 5; // px;
      const x = e.clientX;
      const y = e.clientY;
      const tooltipElementBox = tooltipElement.getBoundingClientRect();
      const tooltipHeight = tooltipElementBox.top + tooltipElementBox.height - tooltipElementBox.top;

      const fullWidth = document.body.clientWidth;
      const enoughSpaceOnTheRight = x + tooltipElementBox.width <= fullWidth;

      if (enoughSpaceOnTheRight || tooltipElementBox.width === fullWidth) {
        this.set(tooltipElement, 'left', x + tooltipOffset);
      } else {
        this.set(tooltipElement, 'left', x - tooltipElementBox.width - tooltipOffset);
      }
      this.set(tooltipElement, 'top', y - tooltipHeight - tooltipOffset);
    };

    setInitialStyleForMouseMove = () => {
      if (this.tooltipElement) {
        const block =
          this.props._activeTooltip.themeStyle === 'light'
            ? `in-tooltip-presenter__light`
            : `in-tooltip-presenter__dark`;
        this.tooltipElement.classList.add(block);

        // because first time rendering already happenend, the tooltip would stick in the top left corner until the first mousemove is fired
        const initialPosition = 1000000; // Number.MAX_VALUE does not apply
        this.set(this.tooltipElement, 'left', initialPosition);
        this.set(this.tooltipElement, 'top', initialPosition);
      }
    };

    render() {
      const tooltip = this.props._activeTooltip;
      if (!tooltip) {
        return null;
      }

      return <div ref={tooltipElement => (this.tooltipElement = tooltipElement)}>{tooltip.content}</div>;
    }
  }
);
