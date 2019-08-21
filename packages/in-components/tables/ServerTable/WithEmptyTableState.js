import { compose, withProps } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import { getPlural } from 'in-sdk/pluginName';

export default function withEmptyTableState(props) {
  return compose(withProps(props))(ServerTableWithEmptyState);
}

function ServerTableWithEmptyState(props) {
  return (
    <WithEmptyStateFallback
      center={false}
      getHasDataToRender={() => isPaginatedResultEmpty(props.get(props))}
      FallbackComponent={() => (
        <ServerTablePresenter
          {...props}
          result={{ errors: [], progress: { loading: false }, data: { items: [] } }}
          renderNoDataAvailable={() => NoDataAvailable(props)}
        />
      )}
    >
      <props.Component {...props} />
    </WithEmptyStateFallback>
  );
}

function NoDataAvailable({ icon, entityName, plugin }) {
  const entitiesName = getPlural(plugin) || entityName || 'entities';
  return (
    <CenterAlignmentColumn>
      <EntityPageMainNotification
        title={`No ${entitiesName} available`}
        plugin={plugin}
        icon={icon}
        explanation={`There were no ${entitiesName} retrieved for the selected time range`}
      />
    </CenterAlignmentColumn>
  );
}

// TODO: as an enhancement, we can add "isXYZDataAvailable" subscriptions. Meanwhile we are checking the result of the data subscription
function isPaginatedResultEmpty(paginatedResult$) {
  return paginatedResult$
    .map(result => result.data)
    .filter(Boolean)
    .map(result => get(result, ['items', 'length'], 0) > 0);
}
