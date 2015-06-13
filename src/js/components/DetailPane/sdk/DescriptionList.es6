'use strict';

import React from 'react';

import classnames from 'instana-ui-services/util/classnames';

import './DescriptionList.less';

const block = 'in-detail-pane';

export const DescriptionList = React.createClass({

  render() {
    return (
      <dl className={block + '__description-list'}>
        {this.props.children.map(child =>
          this.renderItem(child.props)
        )}
      </dl>
    );
  },

  renderItem(descriptionItemProps) {
    if (this.isItemEmpty(descriptionItemProps)) {
      return null;
    }

    return (
      <div key={descriptionItemProps.title}
           className={classnames({
             [block + '__description-item']: true,
             [block + '__description-item--horizontal']: this.props.horizontal
           })}>
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
    if (!children) {
      return true;
    }

    if (!children.length) {
      return true;
    }

    // React avoids using an array of children when there is only one child
    // node. In these cases we are going to have a string
    if (typeof children === 'string') {
      return false;
    }

    for (let i = 0; i < children.length; i++) {
      if (children[i]) {
        return false;
      }
    }

    return true;
  }
});


export const DescriptionItem = React.createClass({
  render() {
    return null;
  }
});
