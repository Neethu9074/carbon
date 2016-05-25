import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {timelineScale$} from 'in-components/timeline/timelineStore';
import {formatDate, formatTime} from 'in-services/formatters/date';
import {highlightedMoment$, to$} from 'in-stores/timeline';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import './HighlightedMomentIndicator.less';

const block = 'in-highlighted-moment-indicator';

export default connectTo({
    scale: timelineScale$,
    highlightedMoment: highlightedMoment$,
    to: to$
  }, React.createClass({
  displayName: 'HighlightedMomentIndicator',

  mixins: [PureRenderMixin],

  propTypes: {
    scale: React.PropTypes.object,
    highlightedMoment: React.PropTypes.number
  },

  render() {
    const scale = this.props.scale;
    const highlightedMoment = this.props.highlightedMoment;
    if (!scale || !highlightedMoment) {
      return null;
    }

    let position = scale.getRange(highlightedMoment);
    let textAlign;

    if (position > scale.getRangeTo() * 0.8) {
      textAlign = 'right';
      position -= 150;
    } else if (position < scale.getRangeTo() * 0.2) {
      textAlign = 'left';
    } else {
      textAlign = 'center';
      position -= 75;
    }

    const style = {
      left: toPx(position),
      textAlign
    };
    return (
      <div className={block}
           style={style}>
        <span className={block + '__date'}>
          {formatDate(highlightedMoment)}
        </span>
        &nbsp;
        <span className={block + '__time'}>
          {formatTime(highlightedMoment)}
        </span>
      </div>
    );
  }
}));
