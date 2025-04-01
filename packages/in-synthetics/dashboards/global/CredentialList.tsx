/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { OrderDirection, TagFilterExpression } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { getAllSyntheticCredentialsForEntitySelectionWithDefaults } from 'in-synthetics/subscriptions/getAllSyntheticTestsForEntitySelection';
// @ts-expect-error
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import CreateCredentialsButton from 'in-synthetics/dashboards/global/tabs/tests/components/CreateCredentialsButton';
import columnDefinitions from 'in-synthetics/dashboards/global/tabs/credentials/components/columnDefinitions';
// @ts-expect-error
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import ViewSwitcher from 'in-synthetics/dashboards/global/tabs/tests/components/ViewSwitcher';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import getCredentialList from 'in-synthetics/subscriptions/getCredentialList';
import { syntheticSwitchCredentialTab } from 'in-synthetics/tracking/tracker';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { CONTAINS } from 'in-components/QueryBuilder/tagFilter/operators';
import { syntheticCredentialPath } from 'in-synthetics/navigation/paths';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Sticky from 'in-components/Sticky';
import Footer from 'in-components/Footer';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function CredentialList() {
  const timeConfig = useTimeConfig();
  const location = useLocation();
  const { trackCta } = useSegmentTracking();
  const pathSegment = syntheticCredentialPath;
  const matrixPrefix = '';
  const ServerTableWithUrlState = createServerTableWithUrlState({
    Renderer: withEmptyTableState({
      columnDefinitions: columnDefinitions,
      title: t('in-synthetics:dashboard.credentialList.noDataAvailable.noCredentialsAvailableTitle'),
      description: t('in-synthetics:dashboard.credentialList.noDataAvailable.noCredentialsAvailableDescription')
    }),
    paginationResettingUrlParameters: [timeConfigUrlParameters],
    columnDefinitions: columnDefinitions,
    defaultOrderBy: 'credentialName',
    defaultOrderDirection: 'ASC',
    pathSegment,
    matrixPrefix
  });
  syntheticSwitchCredentialTab(trackCta);
  const credentialNames: string[] = [];
  const credentialList = useObservable(
    () => getAllSyntheticCredentialsForEntitySelectionWithDefaults({ timeConfig }),
    []
  );
  credentialList?.data?.map(credential => credentialNames.push(credential.name));
  const rightHeader = () => {
    return role?.canConfigureSyntheticCredentials && <CreateCredentialsButton />;
  };

  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>
        <ViewTrackingMeta
          data={{
            pagePath: location?.pathname,
            productArea: productAreas.synthetic_monitoring,
            pageRootName: pageNames.synthetic_credentials
          }}
        />
        <ServerTableWithUrlState
          get={getCredentialData}
          timeConfig={timeConfig}
          cardTitle={t('in-synthetics:dashboard.credentialList.mainLabel')}
          rightHeader={rightHeader}
        />
      </LeftRightPadding>
      <Footer />
    </Sticky>
  );
}

type GetCredentialData = {
  orderBy: string;
  orderDirection: OrderDirection;
  page: number;
  pageSize: number;
  query: string;
};

export function getCredentialData({
  orderBy = 'credentialName',
  orderDirection = 'ASC',
  page = 1,
  pageSize = 20,
  query = ''
}: GetCredentialData) {
  const baseTagFilterExpression: TagFilterExpression = {
    elements: [],
    logicalOperator: 'AND',
    type: 'EXPRESSION'
  };
  if (query && query.length > 0) {
    baseTagFilterExpression.elements.push({
      value: query,
      name: 'credentialName',
      operator: CONTAINS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    });
  }
  return getCredentialList({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    tagFilterExpression: baseTagFilterExpression
  });
}
