import rpt from 'prop-types';
import React from 'react';

import './TimelineMenuEventLine.less';

const block = 'in-timeline-menu-event-line';

export default class extends React.PureComponent {
  static displayName = 'TimelineMenuEventLine';

  static propTypes = {
    title: rpt.string.isRequired,
    additionalContent: rpt.any,
    count: rpt.number
  };

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
  }

  getClassName = () => {
    return block + (this.props.additionalContent ? ' ' + block + '--with-additional-content' : '');
  };
}
