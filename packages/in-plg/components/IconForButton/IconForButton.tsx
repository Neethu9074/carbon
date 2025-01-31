/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import { IconForButtonProps } from 'in-plg/components/IconForButton/types';

export const IconForButton = ({ icon, iconStyle, iconSize }: IconForButtonProps) => {
  if (!icon) return null;
  return (
    <div className="cds--btn__icon">
      <SvgIcon className={iconStyle} type={icon} color="currentColor" size={iconSize} />
    </div>
  );
};
