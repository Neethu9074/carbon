import PureRenderMixin from 'react-addons-pure-render-mixin';
import rpt from 'prop-types';
import React from 'react';

import './TimelineMenuEventLine.less';

const block = 'in-timeline-menu-event-line';

export default React.createClass({
  displayName: 'TimelineMenuEventLine',

  mixins: [PureRenderMixin],

  propTypes: {
    title: rpt.string.isRequired,
    additionalContent: rpt.any,
    count: rpt.number
  },

  render() {
    return (
      <div className={this.getClassName()}>
        {this.props.additionalContent}
        <div>
          {this.props.title}
          <span className={block + '__counter'}>
            {'(' + this.props.count + ')'}
          </span>
        </div>
      </div>
    );
  },

  getClassName() {
    return block + (this.props.additionalContent ? ' ' + block + '--with-additional-content' : '');
  }
});
