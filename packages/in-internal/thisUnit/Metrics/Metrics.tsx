/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Map } from 'immutable';
import React from 'react';

import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import { buildJsonParser, buildJsonSerializer } from 'in-stores/navigation/matrix';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import Input from 'in-components/form/Input/Input';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';

import locals from './Metrics.mless';

export const path = '/metrics';

export default function() {
  const [state, setState] = useUrlState<{ snapshotId: string }>({
    bind: [
      {
        path,
        name: 'snapshotId',
        serializer: buildJsonSerializer(),
        parser: buildJsonParser(''),
        initialState: ''
      }
    ]
  });

  const snapshotId = useDebouncedValue(state.snapshotId, snapshotId => setState({ snapshotId }));

  const timeConfig = useTimeConfig();

  return (
    <div className={locals.view}>
      <Input
        type="text"
        id="snapshotId-value"
        placeholder="Enter a snapshot id"
        value={snapshotId.value}
        onChange={e => snapshotId.onChange(e.target.value)}
        autoFocus
      />
      {snapshotId.debouncedValue && (
        <CustomMetricsV2
          snapshot={Map({ id: snapshotId.debouncedValue })}
          timeConfig={timeConfig}
          specs={[AVAILABLE_SPECS.GENERIC]}
        />
      )}
    </div>
  );
}
