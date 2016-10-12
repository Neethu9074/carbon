import irpt from 'react-immutable-proptypes';
import React from 'react';

import {toHtml} from 'in-services/formatters/markdown';

import SnapshotDescription from '../SnapshotDescription';


const MAX_PROBLEM_TEXT_LENGTH = 1000;
const block = 'in-event-description';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'EventContent',

  propTypes: {
    showFullTextIfToLong: rpt.bool.isRequired,
    snapshotId: rpt.string.isRequired,
    color: rpt.string.isRequired,
    event: irpt.map.isRequired
  },

  render() {
    const showFullTextIfToLong = this.props.showFullTextIfToLong;
    const snapshotId = this.props.snapshotId;
    const event = this.props.event;
    const color = this.props.color;

    let fixSuggestion = event.getIn(['problem', 'fixSuggestion']);
    fixSuggestion = (!showFullTextIfToLong && fixSuggestion.length > MAX_PROBLEM_TEXT_LENGTH) ?
      'further information are available in the notification center' :
      toHtml(fixSuggestion);

    return (
      <div>
        <div className={block + '__header'}
             style={{color}}>
          {event.getIn(['problem', 'problemText'])}
        </div>

        <div className={block + '__suggestion'}
             dangerouslySetInnerHTML={{__html: fixSuggestion}} />

        <SnapshotDescription snapshotId={snapshotId}
                             time={event.get('start')} />
      </div>
    );
  }
});
