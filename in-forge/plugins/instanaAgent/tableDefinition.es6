import React from 'react';

import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import {emptyMap} from 'in-services/fixedImmutables';

export default [
  {
    title: 'Hostname',
    sortableType: String,
    get(snapshot) {
      const label = snapshot.getIn(['data', 'hostname']);

      return {
        content: (
          <HierarchicalLink snapshotId={snapshot.get('id')}
                            kind='dark'>
            {label}
          </HierarchicalLink>
        ),
        sortable: label
      };
    }
  }, {
    title: 'Status',
    sortableType: String,
    get(snapshot) {
      // After new licensing is out also 0=off / 1=Infrastructure / 2=Application
      return snapshot.getIn(['data', 'mode']) ? 'active' : 'inactive';
    }
  }, {
    title: 'Java Runtime',
    sortableType: String,
    get(snapshot) {
      const java = snapshot.getIn(['data', 'java'], emptyMap);
      return java.get('vmvendor') + ' ' + java.get('version') + ' ' + java.get('vmversion');
    }
  },
];
