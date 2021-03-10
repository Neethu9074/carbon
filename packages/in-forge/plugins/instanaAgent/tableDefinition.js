/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { modes } from 'in-forge/plugins/instanaAgent/modes';
import { emptyMap } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default {
  initialSortColumn: 0,
  initialSortDirection: 'asc',

  cols: [
    {
      title: t('in-forge:plugins.instanaAgent.hostname'),
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        }
      }
    },
    {
      title: t('in-forge:plugins.instanaAgent.bootVersion'),
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['data', 'boot'], 'unkown');
        }
      }
    },
    {
      title: t('in-forge:plugins.instanaAgent.mode'),
      type: 'string',
      typeArgs: {
        getValue(row) {
          return modes[row.snapshot.getIn(['data', 'mode'])];
        }
      }
    },
    {
      title: t('in-forge:plugins.instanaAgent.javaRuntime'),
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
