/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ServiceLevelsAlertConfigWithMetadata } from '@instana/types';
import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

import useHrefToSloAlertConfig from 'in-service-levels/navigation/hooks/useHrefToSloAlertConfig';

interface SloAlertConfigButtonProps {
  sloId: string;
  alertConfig: ServiceLevelsAlertConfigWithMetadata;
}

export default function SloAlertConfigButton({ sloId, alertConfig }: SloAlertConfigButtonProps) {
  const alertConfigHref = useHrefToSloAlertConfig({ sloId, config: alertConfig });

  return (
    <Button kind="secondary" href={alertConfigHref}>
      {t('in-events:buttonViewAlertConfig')}
    </Button>
  );
}
