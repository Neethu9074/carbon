import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import Collapsible from 'in-components/Collapsible';

import 'in-components/RightSidebar/components/Metrics/MetricTree.less';


const block = 'in-sidebar-metric-tree';
const rpt = React.PropTypes;
const MetricTree = React.createClass({

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    header: rpt.object.isRequired,
    children: rpt.any,
    style: rpt.object
  },

  renderChildren() {
    const children = this.props.children.size > 1 ?
      this.props.children :
      [this.props.children];

    return (
      <ul className={block + '__ul'}>
        {children.map((child, i) => {
          return (
            <li key={i} className={block + '__li'}>
              {child}
            </li>
          );
        })}
      </ul>
    );
  },

  render() {
    const className = block + '__collapsible';
    return (
      <Collapsible className={className}>
        <Collapsible.Header className={className}>
          {this.props.header.text}
        </Collapsible.Header>

        <Collapsible.Content>
          {this.renderChildren()}
        </Collapsible.Content>
      </Collapsible>
    );
  }
});

export default MetricTree;
