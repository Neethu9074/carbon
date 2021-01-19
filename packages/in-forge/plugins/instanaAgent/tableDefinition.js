/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { modes } from 'in-forge/plugins/instanaAgent/modes';
import { emptyMap } from 'in-services/fixedImmutables';

export default {
  initialSortColumn: 0,
  initialSortDirection: 'asc',

  cols: [
    {
      title: 'Hostname',
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        }
      }
    },
    {
      title: 'Boot Version',
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['data', 'boot'], 'unkown');
        }
      }
    },
    {
      title: 'Mode',
      type: 'string',
      typeArgs: {
        getValue(row) {
          return modes[row.snapshot.getIn(['data', 'mode'])];
        }
      }
    },
    {
      title: 'Java Runtime',
      type: 'string',
      typeArgs: {
        getValue(row) {
          const java = row.snapshot.getIn(['data', 'java'], emptyMap);
          return java.get('vmvendor') + ' ' + java.get('version') + ' ' + java.get('vmversion');
        }
      }
    }
  ]
};
