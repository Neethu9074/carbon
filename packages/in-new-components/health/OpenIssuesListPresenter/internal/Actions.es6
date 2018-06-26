import React from 'react';

import { getButtonKindBySeverity } from 'in-stores/events';
import Button from 'in-new-components/Button';

import locals from './Actions.mless';

export default function Actions({ openIssues }) {
  const maxSeverity = openIssues[0].problem.severity;
  return (
    <div className={locals.actions}>
      <Button icon="lib_events_inverted" kind={getButtonKindBySeverity(maxSeverity)} className={locals.button} asBlock>
        Analyze {openIssues.length} {openIssues.length === 1 ? 'issue' : 'issues'}
      </Button>
    </div>
  );
}
