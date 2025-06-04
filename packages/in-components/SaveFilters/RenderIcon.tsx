/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

//Temporary funct until the carbon issue gets fixed
export const RenderIcon = ({ type, size }: any) => {
  if (!type) return null;
  return (
    <div className="cds--btn__icon">
      <SvgIcon type={type} color="currentColor" size={size} />
    </div>
  );
};
