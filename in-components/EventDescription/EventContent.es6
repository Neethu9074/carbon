import React from 'react';

import SnapshotDescription from 'in-components/SnapshotDescription';
import {toHtml} from 'in-services/formatters/markdown';


const MAX_PROBLEM_TEXT_LENGTH = 1000;
const block = 'in-event-description';

export default function EventContent({showFullTextIfToLong, snapshotId, event, color}) {
  let fixSuggestion = event.getIn(['problem', 'fixSuggestion']);
  fixSuggestion = (!showFullTextIfToLong && fixSuggestion.length > MAX_PROBLEM_TEXT_LENGTH) ?
    'further information are available in the notification center' :
    toHtml(fixSuggestion);

  return (
    <div>
      <div className={`${block}__header`}
           style={{color}}>
        {event.getIn(['problem', 'problemText'])}
      </div>

      <div className={`${block}__suggestion`}
           dangerouslySetInnerHTML={{__html: fixSuggestion}} />

      <SnapshotDescription snapshotId={snapshotId}
                           time={event.get('start')} />
    </div>
  );
}
