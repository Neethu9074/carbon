import React from 'react';

import Table from 'in-sdk/components/dashboard/Table';

import './MatchingEntityTable.less';

const block = 'in-dynamic-rule-dialog-matchin-entities-table';

const cols = [
  {
    title: '',
    type: 'custom',
    disableSorting: true,
    width: 30,
    typeArgs: {
      get(row) {
        return {
          value: row.isExcluded,
          content: (
            <span
              className={`${block}__exclude-label`}
              onClick={() => (row.isExcluded ? row.includeEntity(row.key) : row.excludeEntity(row.key))}
            >
              <input
                type="checkbox"
                checked={!row.isExcluded}
                onChange={() => (row.isExcluded ? row.includeEntity(row.key) : row.excludeEntity(row.key))}
              />
            </span>
          )
        };
      }
    }
  },
  {
    title: 'Name',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshot(row) {
        return row.snapshot;
      }
    }
  }
];

export default function MatchingEntityTable({ form, getRowDetails, excludeEntity, includeEntity }) {
  const matchingEntities = form.get('matchingEntities').map(field => field.value);
  let rows;
  if (matchingEntities && matchingEntities.snapshots) {
    rows = matchingEntities.snapshots.map(snapshot => {
      return {
        key: snapshot.get('id'),
        snapshot,
        isExcluded: form.get('excludedSnapshotIds').value.indexOf(snapshot.get('id')) >= 0,
        excludeEntity,
        includeEntity
      };
    });
  } else {
    rows = [];
  }

  return (
    <div className={block}>
      <Table cols={cols} rows={rows} maxItemsPerPage={10} getRowDetails={getRowDetails} initialSortColumn={1} />
    </div>
  );
}
