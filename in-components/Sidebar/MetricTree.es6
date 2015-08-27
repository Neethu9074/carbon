import React from 'react/addons';

import Collapsible from '../Collapsible';

import './MetricTree.less';

const block = 'in-sidebar-metric-tree';
const rpt = React.PropTypes;
const MetricTree = React.createClass({

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    header: rpt.object.isRequired,
    children: rpt.any,
    style: rpt.object,
    className: rpt.string
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
    return (
      <Collapsible>
       <Collapsible.Header>
         {this.props.header.text + ' (' + this.props.children.size + ')'}
       </Collapsible.Header>

       <Collapsible.Content>
         {this.renderChildren()}
       </Collapsible.Content>
      </Collapsible>
    );
  }
});

export default MetricTree;
