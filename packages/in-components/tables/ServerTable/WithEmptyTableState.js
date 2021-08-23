/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { withProps } from 'recompose';
import React from 'react';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import EntityPageMainNotification from 'in-components/EntityPageMainNotification';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { t } from 'in-i18n';

export default function withEmptyTableState(props) {
  return withProps(props)(ServerTableWithEmptyState);
}

function ServerTableWithEmptyState(props) {
  return <ServerTablePresenter {...props} renderNoDataAvailable={() => NoDataAvailable(props)} />;
}

function NoDataAvailable(props) {
  const { title, description } = props;
  return (
    <CenterAlignmentColumn>
      <EntityPageMainNotification
        {...props}
        title={title || t('in-components:tables.noDataAvailable.entititiesTitle')}
        explanation={description || t('in-components:tables.noDataAvailable.entititiesDescription')}
      />
    </CenterAlignmentColumn>
  );
}
