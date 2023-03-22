/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import exploreKubernetesClusters from 'in-kubernetes/subscriptions/exploreKubernetesClusters';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { ClusterList } from 'in-kubernetes/explore/ClusterList';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { isLoading, hasError } from 'in-services/util/result';
import { Col, Row } from 'in-components/layout/Grid';
import useTimeConfig from 'in-hooks/useTimeConfig';

export const sidebarCols = 3;
export const mainCols = 12;

export default function KubernetesExplore() {
  const timeConfig = useTimeConfig();
  const retrievalSize = 20;
  const result = useCursorPagination(({ cursor }) =>
    exploreKubernetesClusters({
      timeConfig,
      pagination: { cursor: cursor, retrievalSize },
      search: ''
    })
  );
  const loading = isLoading(result);
  const hasErrors = hasError(result);

  if (loading) {
    return <LoadingIndicator size="xl" text={t('in-applications:loadingData')} height={100} />;
  } else if (hasErrors) {
    return <ErroneousResultPresenter errors={result.errors} />;
  }
  return (
    <div>
      <Row>
        <Col md={mainCols}>
          <ClusterList resources={result.items} />
        </Col>
      </Row>
    </div>
  );
}
