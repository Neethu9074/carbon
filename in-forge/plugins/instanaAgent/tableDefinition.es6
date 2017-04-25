import { modes } from 'in-forge/plugins/instanaAgent/modes';
import { emptyMap } from 'in-services/fixedImmutables';

export default [
  {
    title: 'Hostname',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
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
];
