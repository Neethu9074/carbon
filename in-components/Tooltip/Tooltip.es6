import PureRenderMixin from 'react-addons-pure-render-mixin';
import {createLogger} from 'instalog';
import ReactDOM from 'react-dom';
import React from 'react';

import {setActiveTooltip, clearActiveTooltip} from 'in-services/stores/tooltip';


const logger = createLogger('in-components/Tooltip');
const rpt = React.PropTypes;

export default React.createClass({
  displayName: 'Tooltip',

  mixins: [PureRenderMixin],

  propTypes: {
    content: rpt.oneOfType([
      rpt.element.isRequired,
      rpt.string.isRequired
    ]),
    children: rpt.any.isRequired,
    align: rpt.string
  },

  getDefaultProps() {
    return {
      align: 'auto'
    };
  },

  componentDidMount() {
    this.addListeners();
  },

  componentDidUpdate() {
    this.removeListeners();
    this.addListeners();
  },

  removeListeners() {
    if (this.domNode) {
      this.domNode.removeEventListener('mouseleave', this.onMouseOut, false);
      this.domNode.removeEventListener('mouseenter', this.onMouseIn, false);
      this.domNode = null;
    }
  },

  addListeners() {
    try {
      this.domNode = ReactDOM.findDOMNode(this);
      this.domNode.addEventListener('mouseenter', this.onMouseIn, false);
      this.domNode.addEventListener('mouseleave', this.onMouseOut, false);
    } catch (e) {
      /* eslint-disable max-len */
      // We are currently seeing errors being thrown at this location. Trying to drill down on the reason for this
      // error…
      logger.debug(`Failed to add listeners for tooltip. Message: '${e.message}'. Tooltip content: ${String(this.props.content)}`, e);
      /* eslint-enable max-len */
    }
  },

  componentWillUnmount() {
    this.removeListeners();
    if (this.isActive) {
      clearActiveTooltip();
    }
  },

  onMouseIn() {
    setActiveTooltip({
      focusedElement: this.domNode,
      content: this.props.content,
      align: this.props.align || 'auto'
    });
    this.isActive = true;
  },

  onMouseOut() {
    clearActiveTooltip();
    this.isActive = false;
  },

  render() {
    return this.props.children;
  }
});
