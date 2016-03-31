import irpt from 'react-immutable-proptypes';
import moment from 'moment';
import React from 'react';

import {getColorForEvent} from 'in-services/issueTracker';
import {setSelectedSnapshotId} from 'in-stores/snapshot';
import {toHtml} from 'in-services/formatters/markdown';
import {getClassName} from 'in-services/react';
import getSnapshot from 'in-hoc/getSnapshot';

import SnapshotDescription from '../SnapshotDescription';
import Icon from '../Icon';

import './EventDescription.less';


const rpt = React.PropTypes;
const block = 'in-event-description';

export default getSnapshot(React.createClass({

  displayName: 'EventDescription',

  propTypes: {
    snapshotId: rpt.string.isRequired,
    event: irpt.map.isRequired,
    className: rpt.string,
    snapshot: irpt.map
  },

  render() {
    const event = this.props.event;
    const color = getColorForEvent(event);
    const className = getClassName(this, block);

    return (
      <div className={className}
           onClick={this.onClick}>
        <Icon className={block + '__icon'}
              type={this.getIconType(event)}
              style={{color}}/>
        <div className={block + '__description'}>
          <div className={block + '__time'}>
            {moment(event.get('start')).fromNow()}
          </div>

          <div className={block + '__header'}
            style={{color}}>
            {event.getIn(['problem', 'problemText'])}
          </div>

          <div className={block + '__suggestion'}
               dangerouslySetInnerHTML={{__html: toHtml(event.getIn(['problem', 'fixSuggestion']))}} />

          <SnapshotDescription snapshot={this.props.snapshot} />
        </div>
      </div>
    );
  },

  getIconType(event) {
    const severity = event.getIn(['problem', 'severity']);

    if (severity < 0) {
      return 'instana_change';
    } else if (severity > 8) {
      return 'critical';
    }
    return 'warning';
  },

  onClick() {
    setSelectedSnapshotId(this.props.snapshotId);
  }
}));
