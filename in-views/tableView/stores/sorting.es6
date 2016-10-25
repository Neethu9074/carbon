import {isEqual} from 'lodash';

import {snapshotIds$} from 'in-views/tableView/stores/snapshotIds';

export const sortedSnapshotIds$ = snapshotIds$
  .map(snapshotIds => snapshotIds.slice().sort())
  .distinct((a, b) => !isEqual(a, b));
