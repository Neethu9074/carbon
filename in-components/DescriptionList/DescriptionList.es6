/* eslint-disable react/no-multi-comp */
import React from 'react';

import './DescriptionList.less';

const rpt = React.PropTypes;
const block = 'in-detail-pane';

export const DescriptionList = React.createClass({

  propTypes: {
    children: rpt.any
  },

  render() {
    return (
      <dl className={block + '__description-list'}>
        {this.renderItems()}
      </dl>
    );
  },

  renderItems() {
    if (!this.props.children) {
      return null;
    }

    if (this.props.children instanceof Array) {
      if (this.props.children.length === 0) {
        return null;
      }

      return this.props.children
        .filter(children => children)
        .map((child, i) => {
          return this.renderItem(child.props, i);
        });
    }

    return this.renderItem(this.props.children.props, 0);
  },

  renderItem(descriptionItemProps, i) {
    if (this.isItemEmpty(descriptionItemProps)) {
      return null;
    }

    const textClassName = block + '__description-text ';
    let divClasses = block + '__description-item';
    if (descriptionItemProps.addSeparator && i > 0) {
      divClasses = `${divClasses} ${divClasses}--with-separator`;
    }

    return (
      <div key={descriptionItemProps.id || descriptionItemProps.title}
           className={divClasses}>
        <dt className={block + '__description-title'}>
          {descriptionItemProps.title}
        </dt>
        <dd className={textClassName}
            onClick={descriptionItemProps.onClick}>
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
