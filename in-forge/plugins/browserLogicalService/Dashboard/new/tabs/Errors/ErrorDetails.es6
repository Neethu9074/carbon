import React from 'react';

import ErrorBreakdownTable from 'in-forge/plugins/browserLogicalService/Dashboard/new/components/ErrorBreakdownTable';
import { getLabel } from 'in-sdk/snapshot';

export default function ErrorDetails({ match, snapshot, timeframe }) {
  const errorHash = match.params.errorHash;

  // TODO put the code of breakdown table into this component, improve it and gahter/pass the following properties
  // to the component
  /* errorMessage={message}*/
  // pageHash={pageHash}
  // pageLabel={pageLabel}

  return (
    <div>
      <ErrorBreakdownTable
        errorHash={errorHash}
        websiteSnapshotId={snapshot.get('id')}
        timeframe={timeframe}
        websiteLabel={getLabel(snapshot)}
        errorMessage=""
      />
    </div>
  );
}
