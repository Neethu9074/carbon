/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import { t } from 'in-i18n';

export default function HelpAndSupport({ trackingService }) {
  return (
    <ExpandableLightCard title={t('in-waiting-for-deployment:helpSupport')} framed={false} openByDefault={false}>
      <Button
        kind="secondary"
        icon="lib_help_error_help_outline"
        target="_blank"
        href="https://instana.com/docs/"
        onClick={() => trackingService.helpAndSupportClicked()}
      >
        {t('in-waiting-for-deployment:helpDocumentation')}
      </Button>
    </ExpandableLightCard>
  );
}
