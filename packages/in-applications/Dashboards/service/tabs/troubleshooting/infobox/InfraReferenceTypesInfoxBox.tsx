/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { t } from '@instana/i18n-react';

// @ts-expect-error
import ExpandableCard from 'in-components/AnalyzeView/FacetedFilters/ExpandableCardWithSubtitle';

import locals from './Infobox.mless';

export default function InfraReferenceTypesInfoxBox() {
  return (
    <ExpandableCard
      title={t('in-applications:serviceTroubleshooting.troubleShootingExplanation')}
      className={locals.marginTop}
    >
      <p>{t('in-applications:serviceTroubleshooting.infraReferenceTypeDocumentation')} PhysicalReference.java</p>
    </ExpandableCard>
  );
}
