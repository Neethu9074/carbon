/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { Link } from '@instana/components';
import { t } from '@instana/i18n-react';

// @ts-expect-error
import ExpandableCard from 'in-components/AnalyzeView/FacetedFilters/ExpandableCardWithSubtitle';

import locals from './Infobox.mless';

export default function ServiceMappingInfoBox() {
  return (
    <ExpandableCard
      title={t('in-applications:serviceTroubleshooting.troubleShootingExplanation')}
      className={locals.marginTop}
    >
      <p>{t('in-applications:serviceTroubleshooting.serviceRuleDocumentation')} defaultServiceRules.yaml</p>
      <p>
        {t('in-applications:serviceTroubleshooting.customServiceRuleDocumentation')}{' '}
        <Link href={'#/services/configure/new'}>
          {t('in-applications:serviceTroubleshooting.customServiceRuleConfiguration')}
        </Link>
      </p>
    </ExpandableCard>
  );
}
