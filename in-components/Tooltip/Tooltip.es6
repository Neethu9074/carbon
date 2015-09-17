import React from 'react/addons';

import * as tooltipStore from 'in-services/stores/tooltip';

const rpt = React.PropTypes;

const Tooltip = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    content: rpt.oneOfType([
      rpt.element.isRequired,
      rpt.string.isRequired
    ]),
    children: rpt.any.isRequired,
    align: rpt.string
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
    this.domNode = React.findDOMNode(this);
    this.domNode.addEventListener('mouseenter', this.onMouseIn, false);
    this.domNode.addEventListener('mouseleave', this.onMouseOut, false);
  },

  componentWillUnmount() {
    this.removeListeners();
  },

  onMouseIn() {
    tooltipStore.setActiveTooltip({
      focusedElement: this.domNode,
      content: this.props.content,
      align: this.props.align ? this.props.align : 'auto'
    });
  },

  onMouseOut() {
    tooltipStore.clearActiveTooltip();
  },

  render() {
    return this.props.children;
  }
});

export default Tooltip;
