/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { SvgIcon, Typography, Spacer } from '@instana/components';
import { Event } from '@instana/types';

import CreatePolicyButton from 'in-automation/AutomationCard/CreatePolicyButton';
import { t, Trans } from 'in-i18n';

import locals from 'in-automation/AutomationCard/EmptyState.mless';

export default function EmptyState({ event }: { event: Event }) {
  return (
    <div className={locals.emptyRecomendedActions}>
      <SvgIcon type={'lib_carbon_empty_state'} size="xxxl" />
      <div className={locals.emptyStateContent}>
        <Typography variant="heading-400"> {t('in-automation:emptyRecommendedActions')}</Typography>
        {<p className={locals.emptyStateSubtitle}>{t('in-automation:emptyRecommendedActionsDescription1')}</p>}
        <Spacer vertical="xsmall" />
        {
          <p className={locals.emptyStateSubtitle}>
            <Trans i18nKey="in-automation:emptyRecommendedActionsDescription2" />
          </p>
        }
        <CreatePolicyButton event={event} />
      </div>
    </div>
  );
}
