import React from 'react';

import UnitsBreadcrumb from 'in-internal/monitoringUnit/units/UnitsBreadcrumb';
import InternalViewWrapper from 'in-internal/components/InternalViewWrapper';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getModifiedUrlStream } from 'in-stores/navigation';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import search from 'in-subscription/search';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

const cols = [
  {
    id: 'unit',
    title: 'Unit',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return `${row.tenant}-${row.unit}`;
      },
      getContent(val, row) {
        return (
          <Link
            href$={getModifiedUrlStream(params => {
              params.pathname = '/internal/monitoringUnit/unit';
              setOrDeleteMatrixKey(params, '/unit', 'tenant', row.tenant);
              setOrDeleteMatrixKey(params, '/unit', 'unit', row.unit);
            })}
          >
            {val}
          </Link>
        );
      }
    }
  }
];

export default connect(
  () => ({
    units: timeConfig$.flatMap(timeConfig =>
      search({
        query: 'entity.selfType:entityStatistics',
        view: 'TABLE',
        timeConfig,
        restrictResultEntityType: 'entityStatistics'
      })
        .flatMap(getSnapshots)
        .map(snapshots =>
          snapshots.map(snapshot => ({
            tenant: snapshot.getIn(['data', 'tenant']),
            unit: snapshot.getIn(['data', 'unit'])
          }))
        )
    )
  }),
  function UnitList({ units }) {
    return (
      <InternalViewWrapper>
        <Breadcrumbs items={[<UnitsBreadcrumb />]} />

        {!units && <LoadingIndicator type="dark" />}

        {units && (
          <Table
            cardTitle="Units"
            withoutPadding
            cols={cols}
            rows={units.map(({ tenant, unit }) => ({ key: `${tenant}-${unit}`, tenant, unit }))}
            maxItemsPerPage={50}
          />
        )}
      </InternalViewWrapper>
    );
  }
);
