/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import { getEntityNameByType, getIconByType } from 'in-analyze/AnalyzeView/dataSources';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

export default function EmptyAnalyzeView({ type }) {
  const entityName = getEntityNameByType(type);
  return (
    <Sticky header={<AnalyzeHeader />}>
      <CenterAlignmentColumn>
        <EntityPageMainNotification
          icon={getIconByType(type, 'profiling')}
          explanation={t('in-profiling:noProfilesAreAvailableForTheSelectedTimeRange')}
          title={t('in-profiling:noEntityFound', { entityName: entityName })}
        />
      </CenterAlignmentColumn>
    </Sticky>
  );
}
