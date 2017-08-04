import rpt from 'prop-types';
import React from 'react';

import './LoadingIndicator.less';

const block = 'in-loading-indicator';
const rectClass = block + '__rect';

export default class extends React.PureComponent {
  static displayName = 'LoadingIndicator';

  static propTypes = {
    type: rpt.string,
    inline: rpt.bool,
    style: rpt.object,
    className: rpt.string
  };

  static defaultProps = {
    type: 'light'
  };

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const rects = [];
    const colorClass = this.props.type !== 'light' ? ' ' + rectClass + '--' + this.props.type : '';

    for (let i = 1; i < 6; i++) {
      rects.push(<div key={i} className={rectClass + '--' + i + ' ' + rectClass + colorClass} />);
    }

    let classes = block;
    if (this.props.inline !== true) {
      classes = `${classes} ${block}--block`;
    }

    if (this.props.className) {
      classes = `${classes} ${this.props.className}`;
    }

    return (
      <div className={classes} style={this.props.style}>
        {rects}
      </div>
    );
  }
}
