/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card } from '@instana/components';

import {
  clusterIdUrlParameter,
  podIdUrlParameter,
  deploymentIdUrlParameter,
  deploymentConfigIdUrlParameter
} from 'in-kubernetes/navigation/urlParameters';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import getKubernetesConditions from 'in-subscription/kubernetes/getKubernetesConditions';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { t } from 'in-i18n';

const pathSegment = '/conditions';
const matrixPrefix = 'condition.';

const columnDefinitions = [
  {
    id: 'type',
    label: t('in-kubernetes:dashboards.name'),
    getContent(item) {
      return item.type;
    }
  },
  {
    id: 'status',
    label: t('in-kubernetes:dashboards.status'),
    getContent(item) {
      return item.status;
    }
  },
  {
    id: 'lastTransitionTime',
    label: t('in-kubernetes:dashboards.lastTransitionTime'),
    getContent(item) {
      return item.lastTransitionTime || valueMissingPlaceholder;
    }
  },
  {
    id: 'reason',
    label: t('in-kubernetes:dashboards.reason'),
    getContent(item) {
      return item.reason || valueMissingPlaceholder;
    }
  },
  {
    id: 'message',
    label: t('in-kubernetes:dashboards.message'),
    getContent(item) {
      return item.message || valueMissingPlaceholder;
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    entityName: 'conditions'
  }),
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    clusterIdUrlParameter,
    podIdUrlParameter,
    deploymentIdUrlParameter,
    deploymentConfigIdUrlParameter
  ],
  columnDefinitions,
  defaultOrderBy: 'type',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function Conditions(props) {
  return (
    <Card>
      <ServerTableWithUrlState get={getTableData} {...props} />
    </Card>
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'type',
  orderDirection = 'ASC',
  timeConfig,
  podId,
  nodeId,
  deploymentId,
  deploymentConfigId
}) {
  return getKubernetesConditions({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      label: query,
      podId,
      nodeId,
      deploymentId,
      deploymentConfigId,
      timeConfig
    }
  });
}
