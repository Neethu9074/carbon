/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, withProps } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import EntityPageMainNotification from 'in-components/EntityPageMainNotification';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import { emptyListResult } from 'in-services/util/result';
import { getPluginName } from 'in-sdk/pluginName';
import { t } from 'in-i18n';

export default function withEmptyTableState(props) {
  return compose(withProps(props))(ServerTableWithEmptyState);
}

function ServerTableWithEmptyState(props) {
  return (
    <WithEmptyStateFallback
      center={false}
      getHasDataToRender={() => isPaginatedResultEmpty(props.get(props))}
      fallbackComponentProps={props}
      FallbackComponent={FallbackComponent}
    >
      <ServerTablePresenter {...props} />
    </WithEmptyStateFallback>
  );
}

function FallbackComponent(props) {
  return (
    <ServerTablePresenter {...props} result={emptyListResult} renderNoDataAvailable={() => NoDataAvailable(props)} />
  );
}

function NoDataAvailable(props) {
  const { entityName, plugin } = props;
  const entitiesName =
    getPluginName(plugin, 0) || entityName || t('in-components:tables.serverTable.withEmptyTableStateEntitiesName');
  return (
    <CenterAlignmentColumn>
      <EntityPageMainNotification
        {...props}
        title={t('in-components:tables.serverTable.withEmptyTableStateEntityPageMainNotificationTitle', {
          name: entitiesName
        })}
        explanation={t('in-components:tables.serverTable.withEmptyTableStateEntityPageMainNotificationExplanation', {
          name: entitiesName
        })}
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
