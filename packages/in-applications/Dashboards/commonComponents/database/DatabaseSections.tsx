/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Result, EndpointType, BoundaryScope, TimeConfig, ApplicationBoundaryScope } from '@instana/types';
import { useObservable } from '@instana/hooks';

import DatabaseStatementTopList from 'in-applications/Dashboards/commonComponents/database/DatabaseStatementTopList';
import WidgetNotActive from 'in-applications/Dashboards/commonComponents/WidgetNotActive';
import getEndpointTypes from 'in-applications/subscriptions/getEndpointTypes';
import { UrlMatrixParamConfig } from 'in-applications/types';
import { t } from 'in-i18n';

interface DatabaseSectionProps {
  boundaryScope: BoundaryScope;
  applicationId: string;
  serviceId: string;
  endpointId: string;
  timeConfig: TimeConfig;
  applicationBoundaryScope: ApplicationBoundaryScope;
  types: EndpointType[];
  urlMatrixParamConfig: UrlMatrixParamConfig;
  renderHistoricDataIndicator: boolean;
}

export default function DatabaseSections(props: DatabaseSectionProps) {
  const endpointTypes = useObservable(
    getEndpointTypes({
      filter: {
        application: props.applicationId,
        service: props.serviceId,
        endpoint: props.endpointId,
        timeConfig: props.timeConfig,
        applicationBoundaryScope: props.applicationBoundaryScope,
        includeInternalCalls: false,
        includeSyntheticCalls: false,
        useLongTermDataOnly: false
      }
    }).map((result: Result<EndpointType[]>) => result.data),
    []
  );

  if (!hasDatabaseEndpoints(endpointTypes)) {
    return null;
  }

  return (
    <Fragment>
      {props.timeConfig.autoRefresh ? (
        <WidgetNotActive title={t('in-applications:titleTopStatements')} />
      ) : (
        <DatabaseStatementTopList {...props} />
      )}
    </Fragment>
  );
}

function hasDatabaseEndpoints(types: EndpointType[] | null | undefined) {
  if (!types) {
    return false;
  }
  return hasType('DATABASE', types);
}

function hasType(type: EndpointType, types: EndpointType[]) {
  return types.indexOf(type) >= 0;
}
