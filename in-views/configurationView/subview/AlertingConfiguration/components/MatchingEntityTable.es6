import React from 'react';

import HealthyPluginIcon from 'in-components/health/HealthyPluginIcon';
import { compareIgnoreCase } from 'in-services/util/string';
import { getDashboardLink } from 'in-stores/navigation';
import Table from 'in-sdk/components/dashboard/Table';
import { getSingular } from 'in-sdk/pluginName';
import { getLabel } from 'in-sdk/snapshot';
import Link from 'in-components/Link';

import './MatchingEntityTable.less';

const block = 'in-alerting-config-dialog-matchin-entities-table';

const cols = [
  {
    title: 'Name',
    type: 'custom',
    typeArgs: {
      comparator: compareIgnoreCase,
      get(row) {
        const label = getLabel(row.snapshot);
        return {
          value: label,
          content: (
            <Link href$={getDashboardLink(row.key)} className={`${block}__link`} target="_block">
              <HealthyPluginIcon
                overrideSnapshot
                snapshot={row.snapshot}
                dimension={12}
                fallbackColor={'#000'}
                className={`${block}__plugin-icon`}
              />
              {label}
            </Link>
          )
        };
      }
    }
  },
  {
    title: 'Entity Type',
    type: 'string',
    typeArgs: {
      comparator: compareIgnoreCase,
      getValue(row) {
        return getSingular(row.snapshot);
      }
    }
  }
];

export default function MatchingEntityTable({ form }) {
  const matchingEntities = form.get('matchingEntities').map(field => field.value);
  let rows;
  if (matchingEntities && matchingEntities.snapshots) {
    rows = matchingEntities.snapshots.map(snapshot => {
      return {
        key: snapshot.get('id'),
        snapshot
      };
    });
  } else {
    rows = [];
  }

  return (
    <div className={block}>
      <Table cols={cols} rows={rows} maxItemsPerPage={10} initialSortColumn={0} />
    </div>
  );
}
