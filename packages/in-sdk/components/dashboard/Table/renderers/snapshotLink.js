/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import invariant from 'invariant';
import React from 'react';

import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import { compareIgnoreCase } from 'in-services/util/string';
import { getSnapshot } from 'in-stores/snapshot';
import { noop } from 'in-services/fixedObjects';
import { getLabel } from 'in-sdk/snapshot';

import './snapshotLink.less';

export const type = 'snapshotLink';

export function validate(col) {
  invariant(
    typeof col.typeArgs.getSnapshotId === 'function' ||
      typeof col.typeArgs.getSnapshotId$ === 'function' ||
      typeof col.typeArgs.getSnapshot === 'function' ||
      typeof col.typeArgs.getSnapshot$ === 'function',
    'Columns with type=snapshotLink must have a getSnapshotId(row), a getSnapshot(row), a getSnapshot$(row) or a getSnapshotId$(row) function.'
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

  const fallbackValue = columnDefinition.typeArgs.getFallbackValue
    ? columnDefinition.typeArgs.getFallbackValue(row.rowConfig)
    : null;
  const column = {
    columnDefinition,
    columnIndex,
    value: fallbackValue,
    content: fallbackContent,
    subscription: null,
    comparator: compareIgnoreCase,
    refreshContent: noop,
    requiresContentRefresh: false
  };

  const withHierarchy = Boolean(columnDefinition.typeArgs.withHierarchy);

  // This is to have searchable column values.
  // If we have useSnapshotFromHierarchyCallback then
  // we can have a situation where the value in
  // the table cell is different than what the label
  // which displays it.
  const fillInColumnValueWithHierarchy = hierarchy => {
    if (hierarchy && hierarchy.length > 0) {
      // add all of hierarchy to cell value
      let columnValForSearching = '';
      hierarchy.map(entity => {
        columnValForSearching = columnValForSearching + entity.get('label', '') + ' ';
      });
      column.value = columnValForSearching;
    }
  };

  const getSnapshotLink = snapshot => {
    column.value = getLabel(snapshot);
    column.content = (
      <HierarchicalLink
        snapshot={snapshot}
        calculateHierarchy={withHierarchy}
        pathname={columnDefinition.typeArgs.pathname}
        kind="dark"
        useSnapshotFromHierarchyCallback={
          columnDefinition.typeArgs.useSnapshotFromHierarchyCallback
            ? (snapshot, hierarchy) => {
                fillInColumnValueWithHierarchy(hierarchy);
                return columnDefinition.typeArgs.useSnapshotFromHierarchyCallback(snapshot, hierarchy);
              }
            : undefined
        }
        className="in-table-snapshot-link"
      />
    );
    row.mutationCount++;
    emitRawDataChange();
  };

  if (columnDefinition.typeArgs.getSnapshotId) {
    const snapshotId = columnDefinition.typeArgs.getSnapshotId(row.rowConfig);
    column.subscription = getSnapshot(snapshotId).subscribe(getSnapshotLink);
  } else if (columnDefinition.typeArgs.getSnapshot) {
    getSnapshotLink(columnDefinition.typeArgs.getSnapshot(row.rowConfig));
  } else if (columnDefinition.typeArgs.getSnapshot$) {
    column.subscription = columnDefinition.typeArgs.getSnapshot$(row.rowConfig).subscribe(getSnapshotLink);
  } else {
    const snapshotId$ = columnDefinition.typeArgs.getSnapshotId$(row.rowConfig);
    column.subscription = snapshotId$
      .flatMap(getSnapshot)
      .filter(snapshot => snapshot !== null)
      .subscribe(getSnapshotLink);
  }

  return column;
}
