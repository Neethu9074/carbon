/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { t } from 'in-i18n';

export default {
  initialSortColumn: 0,
  initialSortDirection: 'asc',

  cols: [
    {
      title: t('in-forge:plugins.crowdStrikeFalcon.table.host'),
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId$(row) {
          return getHostSnapshotId(row.snapshot);
        }
      }
    },
    {
      title: t('in-forge:plugins.crowdStrikeFalcon.table.name'),
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        }
      }
    },
    {
      title: t('in-forge:plugins.crowdStrikeFalcon.version'),
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['data', 'version']);
        }
      }
    },
    {
      title: t('in-forge:plugins.crowdStrikeFalcon.rfm-state'),
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['data', 'rfm-state']);
        }
      }
    },
    {
      title: t('in-forge:plugins.crowdStrikeFalcon.aid'),
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['data', 'aid']);
        }
      }
    },
    {
      title: t('in-forge:plugins.crowdStrikeFalcon.cid'),
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['data', 'cid']);
        }
      }
    }
  ]
};
