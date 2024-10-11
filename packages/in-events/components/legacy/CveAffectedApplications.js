/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { DataTable as CarbonDataTable, TableSkeleton as CarbonTableSkeleton } from '@instana/components';
import { TableLoadingSkeletonRows, Table, Tbody, Td, Th, Thead, Tr } from '@instana/legacy';
import { useObservable } from '@instana/hooks';
import { Card } from '@instana/components';
import { Link } from '@instana/components';

import {
  useLinkToApplicationDashboard,
  useLinkToServiceDashboard,
  useLinkToEndpointDashboard
} from 'in-applications/navigation/paths';
import { getStackForInfrastructure } from 'in-components/Stack/subscriptions/getStack';
import { carbonTableEnabled } from 'in-services/featureFlags';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

import locals from './CveAffectedApplications.mless';

export default function AffectedApplicationPresenter({ id, timeConfig }) {
  const stackResult =
    useObservable(
      getStackForInfrastructure({
        id,
        timeConfig
      }),
      [id, timeConfig]
    ) ?? pendingResult;

  const getLinkToApplicationDashboard = useLinkToApplicationDashboard();
  const getLinkToServiceDashboard = useLinkToServiceDashboard();
  const getLinkToEndpointDashboard = useLinkToEndpointDashboard();

  const getDashboardLink = (item, timeConfig) => {
    if (item.type === 'application') {
      return getLinkToApplicationDashboard({ applicationId: item.id, timeConfig });
    } else if (item.type === 'service') {
      return getLinkToServiceDashboard({ serviceId: item.id, timeConfig });
    } else if (item.type === 'endpoint') {
      return getLinkToEndpointDashboard({
        serviceId: item.serviceId,
        endpointId: item.id,
        timeConfig
      });
    }
    return null;
  };

  if (hasError(stackResult)) {
    return <div>{t('in-events:affectedApplications.errorLoadingData')}</div>;
  }

  const items = stackResult?.data?.application?.groups?.[0]?.items ?? [];

  if (carbonTableEnabled) {
    const carbonHeaders = [
      {
        key: t('in-events:affectedApplications.title'),
        header: t('in-events:affectedApplications.title')
      },
      {
        key: t('in-events:affectedApplications.totalcalls'),
        header: t('in-events:affectedApplications.totalcalls')
      }
    ];

    const carbonRows = items.map((item, index) => {
      const totalCalls = item?.metrics?.callsAgg?.[0]?.[1] || 0;
      const href = getDashboardLink(item, timeConfig);

      return {
        id: `row-${index}`,
        [t('in-events:affectedApplications.title')]: <Link href={href}>{item.label}</Link>,
        [t('in-events:affectedApplications.totalcalls')]: totalCalls
      };
    });

    return (
      <>
        <Row withoutSideMargin>
          <Col xs>
            <Card title="Affected Applications">
              <Fragment>
                {isLoading(stackResult) ? (
                  <CarbonTableSkeleton headers={[]} columnCount={3} rowCount={3} />
                ) : items.length > 0 ? (
                  <CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} />
                ) : (
                  <>
                    <CarbonDataTable headers={carbonHeaders} rows={[]} isSearchEnabled={false} />
                    <div className={locals.noDataMessage}>
                      {t('in-events:affectedApplications.noAffectedApplications')}
                    </div>
                  </>
                )}
              </Fragment>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card title="Affected Applications">
          <Fragment>
            <Table>
              <Thead>
                <Tr size="compact">
                  <Th noWrap>{t('in-events:affectedApplications.title')}</Th>
                  <Th noWrap>{t('in-events:affectedApplications.totalcalls')}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading(stackResult) ? (
                  <TableLoadingSkeletonRows cols={3} />
                ) : (
                  <>
                    {items.map((item, index) => {
                      const totalCalls = item?.metrics?.callsAgg?.[0]?.[1] || 0;
                      const href = getDashboardLink(item, timeConfig);

                      return (
                        <Tr key={index} size="compact">
                          <Td>
                            <Link href={href}>{item.label}</Link>
                          </Td>
                          <Td>{totalCalls}</Td>
                        </Tr>
                      );
                    })}
                  </>
                )}
                {items?.length === 0 && !isLoading(stackResult) && (
                  <Tr size="compact">
                    <Td colSpan={3}>{t('in-events:affectedApplications.noAffectedApplications')}</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Fragment>
        </Card>
      </Col>
    </Row>
  );
}

AffectedApplicationPresenter.propTypes = {
  id: PropTypes.string.isRequired,
  timeConfig: PropTypes.object.isRequired
};
