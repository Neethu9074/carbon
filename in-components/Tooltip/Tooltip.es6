import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import ReactDOM from 'react-dom';

import * as tooltipStore from 'in-services/stores/tooltip';

const rpt = React.PropTypes;

const Tooltip = React.createClass({
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
      this.domNode.removeEventListener('mouseenter', this.onMouseIn, false);
      this.domNode.removeEventListener('mouseleave', this.onMouseOut, false);
      this.domNode = null;
    }
  },

  addListeners() {
    this.domNode = ReactDOM.findDOMNode(this);
    this.domNode.addEventListener('mouseenter', this.onMouseIn, false);
    this.domNode.addEventListener('mouseleave', this.onMouseOut, false);
  },

  componentWillUnmount() {
    if (this.isActive) {
      tooltipStore.clearActiveTooltip();
    }

    this.removeListeners();
  },

  onMouseIn() {
    tooltipStore.setActiveTooltip({
      focusedElement: this.domNode,
      content: this.props.content,
      align: this.props.align || 'auto'
    });
    this.isActive = true;
  },

  onMouseOut() {
    tooltipStore.clearActiveTooltip();
    this.isActive = false;
  },

  render() {
    return this.props.children;
  }
});

export default Tooltip;
