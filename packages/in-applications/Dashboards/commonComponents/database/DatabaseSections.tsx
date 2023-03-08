/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { BoundaryScope, TimeConfig } from '@instana/types';

import DatabaseStatementTopList from 'in-applications/Dashboards/commonComponents/database/DatabaseStatementTopList';
import { UrlMatrixParamConfig } from 'in-applications/types';

interface DatabaseSectionProps {
  boundaryScope: BoundaryScope;
  applicationId: string;
  serviceId: string;
  endpointId: string;
  timeConfig: TimeConfig;
  urlMatrixParamConfig: UrlMatrixParamConfig;
  renderHistoricDataIndicator: boolean;
  renderWidgetNotSupportedIndicator: boolean;
}

export default function DatabaseSections(props: DatabaseSectionProps) {
  return (
    <Fragment>
      <DatabaseStatementTopList {...props} />
    </Fragment>
  );
}
