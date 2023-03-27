/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Li, Typography } from '@instana/components';

import { ProductAreaType } from '../../constants';
import { t } from 'in-i18n';

interface Props {
  area: ProductAreaType;
}
export default function _GeneralPlatformListItem({ area }: Props) {
  return (
    <Li noAlternatingBg key={area}>
      <Typography variant="body-regular">{t('in-settings:productAreas.permissions', { context: area })}</Typography>
    </Li>
  );
}
