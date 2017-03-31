import React from 'react';

import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import { emptyMap } from 'in-services/fixedImmutables';
import { modes } from 'in-forge/plugins/instanaAgent/modes';

export default [
  {
    title: 'Hostname',
    sortableType: String,
    get(snapshot) {
      const label = snapshot.getIn(['data', 'hostname']);

      return {
        content: (
          <HierarchicalLink snapshotId={snapshot.get('id')} kind="dark">
            {label}
          </HierarchicalLink>
        ),
        sortable: label
      };
    }
  },
  {
    title: 'Mode',
    sortableType: String,
    get(snapshot) {
      return modes[snapshot.getIn(['data', 'mode'])];
    }
  },
  {
    title: 'Java Runtime',
    sortableType: String,
    get(snapshot) {
      const java = snapshot.getIn(['data', 'java'], emptyMap);
      return java.get('vmvendor') + ' ' + java.get('version') + ' ' + java.get('vmversion');
    }
  }
];
