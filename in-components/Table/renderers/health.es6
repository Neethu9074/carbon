import invariant from 'invariant';
import React from 'react';

import AnnotatedHealthBar from 'in-components/AnnotatedHealthBar';
import { getHealthInfoAtFocusedMoment } from 'in-stores/events';
import { compare } from 'in-services/util/number';
import { noop } from 'in-services/fixedObjects';

export const type = 'health';

export function validate(col) {
  invariant(
    typeof col.typeArgs.getSnapshotId === 'function' || typeof col.typeArgs.getSnapshotId$ === 'function',
    'Columns with type=health must have a getSnapshotId(row) or a getSnapshotId$(row) function.'
  );
}

export function initialize(row, columnDefinition, columnIndex, emitRawDataChange) {
  const column = {
    columnDefinition,
    columnIndex,
    value: null,
    content: null,
    subscription: null,
    comparator: compare,
    refreshContent: noop
  };

  if (columnDefinition.typeArgs.getSnapshotId) {
    const snapshotId = columnDefinition.typeArgs.getSnapshotId(row.rowConfig);
    column.content = <AnnotatedHealthBar snapshotId={snapshotId} />;
    column.subscription = getHealthInfoAtFocusedMoment(snapshotId).subscribe(healthInfo => {
      column.value = healthInfo.get('maxSeverity');
      row.mutationCount++;
      emitRawDataChange();
    });
  } else {
    const snapshotId$ = columnDefinition.typeArgs.getSnapshotId$(row.rowConfig);
    column.subscription = snapshotId$.flatMap(snapshotId => {
      column.content = <AnnotatedHealthBar snapshotId={snapshotId} />;
      column.subscription = getHealthInfoAtFocusedMoment(snapshotId).subscribe(healthInfo => {
        column.value = healthInfo.get('maxSeverity');
        row.mutationCount++;
        emitRawDataChange();
      });
    });
  }

  return column;
}
