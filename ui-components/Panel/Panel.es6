'use strict';

import React from 'react';

import classnames from 'instana-ui-services/util/classnames';

import './Panel.less';

const block = 'in-detail-pane-panel';

const Panel = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    children: React.PropTypes.any.isRequired
  },

  render() {
    return (
      <div className={block}>
        <h2 className={block + '__heading'}>
          {this.props.title}
        </h2>
        <div className={classnames({
          [block + '__content']: true,
          [block + '__content--open']: true
        })}>
          {this.props.children}
        </div>
      </div>
    );
  }
});

export default Panel;
