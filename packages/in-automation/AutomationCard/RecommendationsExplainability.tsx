/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Spacer, Stack, Typography, Link } from '@instana/components';

import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';
import { Trans, t } from 'in-i18n';

import locals from 'in-automation/AutomationCard/RecommendedActions.mless';

export default function RecommendationsExplainability() {
  return (
    <Dialog
      className={locals.explainabilityDialog}
      title={t('in-automation:recommendedActionsExplanability.sectionHeading')}
      onClose={close}
      doNotCloseOnOutsideClick
    >
      <Stack direction="vertical">
        <Typography variant="heading-200"> {t('in-automation:recommendedActionsExplanability.algorithms')}</Typography>
        <Typography variant="body-regular">
          {' '}
          {t('in-automation:recommendedActionsExplanability.sectionDescription')}
        </Typography>
        <div className={locals.algorithmsSection}>
          <div>
            <Trans i18nKey="in-automation:recommendedActionsExplanability.algorithmSectionText1" />
          </div>
          <Spacer vertical="xsmall" />
          <div>
            <Trans i18nKey="in-automation:recommendedActionsExplanability.algorithmSectionText2" />
          </div>
          <Spacer vertical="xsmall" />
          <div>
            <Trans i18nKey="in-automation:recommendedActionsExplanability.algorithmSectionText3" />
          </div>
        </div>
        <Typography variant="heading-200">
          {' '}
          {t('in-automation:recommendedActionsExplanability.optimizations')}
        </Typography>
        <Typography variant="body-regular">
          {' '}
          {t('in-automation:recommendedActionsExplanability.optimizationsExplanation')}
        </Typography>
        <Typography variant="heading-200"> {t('in-automation:policies.policies')}</Typography>
        <Typography variant="body-regular">
          {' '}
          {t('in-automation:recommendedActionsExplanability.policiesExplanation')}
        </Typography>
        <Link
          href="https://www.ibm.com/docs/en/instana-observability/current?topic=actions-action-recommendation"
          linkIconType={'lib_views_external_link'}
          external
        >
          {t('in-automation:recommendedActionsExplanability.learnMoreLink')}
        </Link>
      </Stack>
    </Dialog>
  );
}
