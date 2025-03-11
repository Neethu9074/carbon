/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import TooltipCalculator from 'in-components/Tooltip/TooltipCalculator';
import { debouncedResize$ } from 'in-services/browser';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import locals from './SingleOverlayPresenter.mless';

export const overlayClassName = locals.overlay;

export default connectTo(
  {
    // the result itself is not used but it triggers a componentDidUpdate which recalculates the position
    debouncedResize: debouncedResize$
  },

  class SingleOverlayPresenter extends React.PureComponent {
    componentDidMount() {
      this.position();
      // Once the Overlay gets mounted(opened) we want to apply focus to it
      this.tooltipElement?.focus();

      // This starts the logic in order to force focus trap inside the overlay
      const id = this.props.id;
      const overlayElement = document.querySelector(`[data-overlay-id=${id}]`);
      const startElement = document.getElementById(`start-${id}`);
      const endElement = document.getElementById(`end-${id}`);
      const triggerTabKey = (shiftKey = false) => {
        const event = new KeyboardEvent('keydown', {
          key: 'Tab',
          code: 'Tab',
          keyCode: 9,
          shiftKey: shiftKey
        });
        document.dispatchEvent(event);
      };
      if (overlayElement) {
        overlayElement.addEventListener('keydown', event => {
          if (event.key === 'Tab' && !event.shiftKey) {
            // TAB
            triggerTabKey(false);
            // If we tab and reach the overlay-end-trap we want to wrap back to the start
            if (document.activeElement && document.activeElement.getAttribute('ID') == `end-${id}`) {
              startElement?.focus();
              triggerTabKey(false);
            }
          } else if (event.shiftKey && event.key === 'Tab') {
            // SHIFT TAB
            triggerTabKey(true);
            // If we tab and reach the overlay-start-trap we want to wrap back to the end
            if (document.activeElement && document.activeElement.getAttribute('ID') == `start-${id}`) {
              endElement?.focus();
              triggerTabKey(true);
            }
          }
        });
      }
    }

    componentWillUnmount() {
      // We want to return focus to the element clicked that initially
      // opened the overlay
      const returnElement = this.props.relativeTo;
      returnElement?.focus();

      // Now we need to remove the event listeners used for focus trap
      const id = this.props.id;
      const overlayElement = document.querySelector(`[data-overlay-id=${id}]`);
      if (overlayElement) overlayElement.removeEventListener('keydown', () => {});
    }

    componentDidUpdate() {
      this.position();
    }

    position() {
      const tooltipElement = this.tooltipElement;
      // add the CSS classes for arrow alignment
      tooltipElement.className = '';
      tooltipElement.classList.add(locals.overlay);
      tooltipElement.classList.add(locals[`style--${this.props.kind || 'popover'}`]);
      if (this.props.inContentArea) {
        tooltipElement.classList.add(locals.inContentArea);
      }
      if (this.props.inSidePanel) {
        tooltipElement.classList.add(locals.inSidePanel);
      }
      if (this.props.behindSidebar) {
        tooltipElement.classList.add(locals.behindSidebar);
      }
      const focusedElementBox = this.props.relativeTo.getBoundingClientRect();
      const tooltipElementBox = tooltipElement.getBoundingClientRect();

      const windowWidth = window.innerWidth - getScrollbarWidth();
      const windowHeight = window.innerHeight;
      const bounds = {
        left: 0,
        top: 0,
        right: windowWidth,
        bottom: windowHeight
      };
      const tooltip = {
        left: tooltipElementBox.left,
        top: tooltipElementBox.top,
        right: tooltipElementBox.left + tooltipElementBox.width,
        bottom: tooltipElementBox.top + tooltipElementBox.height,
        align: this.props.align || 'auto'
      };
      const reference = {
        left: focusedElementBox.left,
        top: focusedElementBox.top,
        right: focusedElementBox.left + focusedElementBox.width,
        bottom: focusedElementBox.top + focusedElementBox.height
      };

      const result = TooltipCalculator.calculate(bounds, tooltip, reference, this.props.forceConfiguredAlignment);

      if (this.props.fixOverlayLeftAlignment) {
        set(tooltipElement, 'left', result.left);
      } else {
        set(tooltipElement, 'left', result.left);
        set(tooltipElement, 'right', result.right !== null ? windowWidth - result.right : null);
      }
      if (this.props.inContentArea) {
        if (result.top != null) {
          set(tooltipElement, 'top', result.top + window.scrollY);
        }
        if (result.bottom != null) {
          set(tooltipElement, 'top', result.bottom - tooltipElementBox.height + window.scrollY);
        }
      } else {
        set(tooltipElement, 'top', result.top);
        set(tooltipElement, 'bottom', result.bottom != null ? windowHeight - result.bottom : null);
      }

      if (!this.props.withoutArrow) {
        tooltipElement.classList.add(locals[`align--${tooltip.align}`]);
      }
    }

    render() {
      const {
        content: Content,
        props,
        id,
        autoOpen,
        autoClose,
        delayedOpen,
        delayedClose,
        inContentArea,
        inSidePanel,
        behindSidebar
      } = this.props;
      return (
        <div
          data-overlay-id={id}
          ref={r => (this.tooltipElement = r)}
          className={classNames({
            [locals.overlay]: true,
            [locals.inContentArea]: inContentArea,
            [locals.inSidePanel]: inSidePanel,
            [locals.behindSidebar]: behindSidebar
          })}
          onMouseEnter={autoOpen ? delayedOpen : undefined}
          onMouseLeave={autoClose ? delayedClose : undefined}
          tabIndex="-1"
          role="dialog"
        >
          {/* Added Spans to define the start of the focus trap*/}
          <span tabIndex={0} role="link" id={`start-${id}`} className={classNames('cds--visually-hidden')} />
          <Content {...props} />
          {/* Added Spans to define the end of the focus trap*/}
          <span tabIndex={0} role="link" id={`end-${id}`} className={classNames('cds--visually-hidden')} />
        </div>
      );
    }
  }
);

function set(ele, prop, value) {
  if (value == null) {
    ele.style[prop] = null;
  } else {
    ele.style[prop] = toPx(value);
  }
}

let cachedScrollbarWidth;
function getScrollbarWidth() {
  if (cachedScrollbarWidth != null) {
    return cachedScrollbarWidth;
  }

  const div = document.createElement('div');
  div.style.width = '100px';
  div.style.overflow = 'scroll';
  div.style.height = '20px';
  div.style.display = 'block';
  div.style.visibility = 'hidden';
  document.body.appendChild(div);
  cachedScrollbarWidth = 100 - div.clientWidth;
  document.body.removeChild(div);
  return cachedScrollbarWidth;
}
