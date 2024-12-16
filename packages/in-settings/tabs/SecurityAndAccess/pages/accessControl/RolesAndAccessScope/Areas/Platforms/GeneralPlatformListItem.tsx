/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Li, Typography } from '@instana/components';

import { ProductAreaType } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { t } from 'in-i18n';

/**
 * Properties for the GeneralPlatformListItem component
 */
interface Props {
  area: ProductAreaType;
}

/**
 * Component to display a "general" platform area, which can only be access all or no access
 * @param param0 See props
 * @returns new instance of component
 */
export default function _GeneralPlatformListItem({ area }: Props) {
  return (
    <Li noAlternatingBg key={area}>
      <Typography variant="body-regular">{t('in-settings:productAreas.permissions', { context: area })}</Typography>
    </Li>
  );
}
