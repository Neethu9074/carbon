/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Typography } from '@instana/components';

import { t } from 'in-i18n';

const NoTagUsedOn = () => {
  return (
    <>
      <Typography variant="heading-03">{t('in-settings:tabs.teams.noDataYet')}</Typography>
      <Typography variant="body-01">{t('in-settings:tabs.teams.teamTagUsedOnEntitiesMessage')}</Typography>
    </>
  );
};

export default NoTagUsedOn;
