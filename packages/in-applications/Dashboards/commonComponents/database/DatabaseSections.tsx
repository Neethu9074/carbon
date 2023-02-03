/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { BoundaryScope, TimeConfig } from '@instana/types';

import DatabaseStatementTopList from 'in-applications/Dashboards/commonComponents/database/DatabaseStatementTopList';
import WidgetNotActive from 'in-applications/Dashboards/commonComponents/WidgetNotActive';
import { UrlMatrixParamConfig } from 'in-applications/types';
import { t } from 'in-i18n';

interface DatabaseSectionProps {
  boundaryScope: BoundaryScope;
  applicationId: string;
  serviceId: string;
  endpointId: string;
  timeConfig: TimeConfig;
  urlMatrixParamConfig: UrlMatrixParamConfig;
  renderHistoricDataIndicator: boolean;
}

export default function DatabaseSections(props: DatabaseSectionProps) {
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
