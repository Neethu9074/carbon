'use strict';

import React from 'react';

import classnames from 'instana-ui-services/util/classnames';

const block = 'in-detail-pane-panel';

const Panel = React.createClass({

  render() {
    return (
      <div className={block}>
        <h2>{this.props.title}</h2>
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
