/* eslint-disable react/no-find-dom-node */
import { createLogger } from 'instalog';
import ReactDOM from 'react-dom';
import rpt from 'prop-types';
import React from 'react';

import { setActiveTooltip, clearActiveTooltip } from 'in-services/stores/tooltip';

const logger = createLogger('in-components/Tooltip');

export default class extends React.PureComponent {
  static displayName = 'Tooltip';

  static propTypes = {
    content: rpt.oneOfType([rpt.element.isRequired, rpt.string.isRequired]),
    themeStyle: rpt.string,
    children: rpt.any.isRequired,
    align: rpt.oneOf([
      'leftBottom',
      'leftMiddle',
      'leftTop',
      'topLeft',
      'topMiddle',
      'topRight',
      'rightTop',
      'rightMiddle',
      'rightBottom',
      'bottomLeft',
      'bottomMiddle',
      'bottomRight',
      'auto',
      'mousePosition'
    ]),
    delay: rpt.number
  };

  static defaultProps = {
    align: 'auto'
  };

  componentDidMount() {
    this.addListeners();
  }

  componentDidUpdate() {
    this.removeListeners();
    this.addListeners();
  }

  removeListeners = () => {
    if (this.domNode) {
      this.domNode.removeEventListener('mouseleave', this.onMouseOut, false);
      this.domNode.removeEventListener('mouseenter', this.onMouseIn, false);
      this.domNode = null;
    }
  };

  addListeners = () => {
    try {
      this.domNode = ReactDOM.findDOMNode(this);
      this.domNode.addEventListener('mouseenter', this.onMouseIn, false);
      this.domNode.addEventListener('mouseleave', this.onMouseOut, false);
    } catch (e) {
      // We are currently seeing errors being thrown at this location. Trying to drill down on the reason for this error…
      logger.debug(
        `Failed to add listeners for tooltip. Message: '${e.message}'. Tooltip content: ${String(this.props.content)}`,
        e
      );
    }
  };

  componentWillUnmount() {
    this.removeListeners();
    if (this.isActive) {
      clearActiveTooltip();
    }
  }

  onMouseIn = () => {
    if (this.props.delay > 0) {
      this.delayedTooltip = setTimeout(() => this.showTooltip(), this.props.delay);
    } else {
      this.showTooltip();
    }
  };

  showTooltip = () => {
    // For a tooltip with delay it can happen that the component for which we want to show the tooltip has been
    // unmounted since the mouseenter event. In these cases the dom node will be null.
    // (componentWillUnmount -> removeListeners)
    if (this.domNode) {
      setActiveTooltip({
        focusedElement: this.domNode,
        content: this.props.content,
        themeStyle: this.props.themeStyle,
        align: this.props.align || 'auto'
      });
      this.isActive = true;
    }
  };

  onMouseOut = () => {
    if (this.delayedTooltip) {
      clearTimeout(this.delayedTooltip);
    }
    clearActiveTooltip();
    this.isActive = false;
  };

  render() {
    return this.props.children;
  }
}
