/*eslint-disable react/no-multi-comp*/

'use strict';

import React from 'react';

import './DescriptionList.less';

const rpt = React.PropTypes;
const block = 'in-detail-pane';

export const DescriptionList = React.createClass({

  propTypes: {
    children: rpt.any.isRequired
  },

  render() {
    return (
      <dl className={block + '__description-list'}>
        {this.renderItems()}
      </dl>
    );
  },

  renderItems() {
    if (this.props.children instanceof Array) {
      return this.props.children.map(child => this.renderItem(child.props));
    } else {
      return this.renderItem(this.props.children.props);
    }
  },

  renderItem(descriptionItemProps) {
    if (this.isItemEmpty(descriptionItemProps)) {
      return null;
    }

    return (
      <div key={descriptionItemProps.title}
           className={block + '__description-item'}>
        <dt className={block + '__description-title'}>
          {descriptionItemProps.title}
        </dt>
        <dd className={block + '__description-text'}>
          {descriptionItemProps.children}
        </dd>
      </div>
    );
  },

  isItemEmpty(descriptionItemProps) {
    const children = descriptionItemProps.children;
    if (children === null || children === undefined) {
      return true;
    }

    // React avoids using an array of children when there is only one child
    // node. In these cases we are going to have a string
    if (typeof children === 'string') {
      return children.length === 0;
    }

    // For any other cases we are currently not able to tell whether it is
    // empty, e.g. for child components.
    return false;
  }
});


export const DescriptionItem = React.createClass({
  render() {
    return null;
  }
});
