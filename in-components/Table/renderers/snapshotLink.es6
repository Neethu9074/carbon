import invariant from 'invariant';
import React from 'react';

import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import { compareIgnoreCase } from 'in-services/util/string';
import { getSnapshot } from 'in-stores/snapshot';
import { noop } from 'in-services/fixedObjects';
import { getLabel } from 'in-sdk/snapshot';

export const type = 'snapshotLink';

export function validate(col) {
  invariant(
    typeof col.typeArgs.getSnapshotId === 'function' || typeof col.typeArgs.getSnapshotId$ === 'function',
    'Columns with type=snapshotLink must have a getSnapshotId(row) or a getSnapshotId$(row) function.'
  );
  invariant(
    col.typeArgs.getFallbackContent == null || typeof col.typeArgs.getFallbackContent === 'function',
    'Columns with type=snapshotLink may define a getFallbackContent property of type function or not define the property at all'
  );
}

export function initialize(row, columnDefinition, columnIndex, emitRawDataChange) {
  const fallbackContent = columnDefinition.typeArgs.getFallbackContent
    ? columnDefinition.typeArgs.getFallbackContent(row.rowConfig)
    : null;
  const column = {
    columnDefinition,
    columnIndex,
    value: null,
    content: fallbackContent,
    subscription: null,
    comparator: compareIgnoreCase,
    refreshContent: noop
  };

  const withHierarchy = Boolean(columnDefinition.typeArgs.withHierarchy);

  if (columnDefinition.typeArgs.getSnapshotId) {
    const snapshotId = columnDefinition.typeArgs.getSnapshotId(row.rowConfig);
    column.subscription = getSnapshot(snapshotId).subscribe(snapshot => {
      column.value = getLabel(snapshot);
      column.content = (
        <HierarchicalLink snapshotId={snapshotId} calculateHierarchy={withHierarchy} kind="dark">
          {column.value}
        </HierarchicalLink>
      );
      row.mutationCount++;
      emitRawDataChange();
    });
  } else {
    const snapshotId$ = columnDefinition.typeArgs.getSnapshotId$(row.rowConfig);
    column.subscription = snapshotId$.flatMap(snapshotId => getSnapshot(snapshotId)).subscribe(snapshot => {
      column.value = getLabel(snapshot);
      column.content = (
        <HierarchicalLink snapshotId={snapshot.get('id')} calculateHierarchy={withHierarchy} kind="dark">
          {column.value}
        </HierarchicalLink>
      );
      row.mutationCount++;
      emitRawDataChange();
    });
  }

  return column;
}
