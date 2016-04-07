import irpt from 'react-immutable-proptypes';
import React from 'react';

import {toHtml} from 'in-services/formatters/markdown';

import SnapshotDescription from '../SnapshotDescription';


const block = 'in-event-description';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'EventContent',

  propTypes: {
    snapshotId: rpt.string.isRequired,
    color: rpt.string.isRequired,
    event: irpt.map.isRequired
  },

  render() {
    const snapshotId = this.props.snapshotId;
    const event = this.props.event;
    const color = this.props.color;

    return (
      <div>
        <div className={block + '__header'}
             style={{color}}>
          {event.getIn(['problem', 'problemText'])}
        </div>

        <div className={block + '__suggestion'}
             dangerouslySetInnerHTML={{__html: toHtml(event.getIn(['problem', 'fixSuggestion']))}} />

        <SnapshotDescription snapshotId={snapshotId} />
      </div>
    );
  }
});
