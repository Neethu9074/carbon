import React from 'react';

import TooltipCalculator from 'in-components/Tooltip/TooltipCalculator';
import { overlays$ } from 'in-new-components/overlays/overlayStore';
import toPx from 'in-services/formatters/toPx';
import connect from 'in-hoc/connectTo';

import locals from './OverlayPresenter.mless';

export default connect({
  overlays: overlays$
})(function OverlayPresenter({ overlays }) {
  return overlays.map((props, i) => <SingleOverlayPresenter key={i} {...props} />);
});

class SingleOverlayPresenter extends React.PureComponent {
  componentDidMount() {
    this.position();
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
      align: 'auto'
    };
    const reference = {
      left: focusedElementBox.left,
      top: focusedElementBox.top,
      right: focusedElementBox.left + focusedElementBox.width,
      bottom: focusedElementBox.top + focusedElementBox.height
    };

    const result = TooltipCalculator.calculate(bounds, tooltip, reference);
    set(tooltipElement, 'left', result.left);
    set(tooltipElement, 'top', result.top);
    set(tooltipElement, 'right', result.right !== null ? windowWidth - result.right : null);
    set(tooltipElement, 'bottom', result.bottom !== null ? windowHeight - result.bottom : null);

    if (!this.props.withoutArrow) {
      tooltipElement.classList.add(locals[`align--${tooltip.align}`]);
    }
  }

  render() {
    const { content: Content, props } = this.props;
    return (
      <div ref={r => (this.tooltipElement = r)}>
        <Content {...props} />
      </div>
    );
  }
}

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
