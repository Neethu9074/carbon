/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Tooltip as CarbonTooltip } from '@instana/components';

import { t } from 'in-i18n';

export default function AISlugIcon() {
  return (
    <CarbonTooltip content={t('in-automation:AISlugContent')}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="AI slug">
          <rect x="0.5" y="0.5" width="31" height="31" fill="white" fillOpacity="0.01" />
          <rect x="0.5" y="0.5" width="31" height="31" stroke="#161616" />
          <path
            id="AI"
            d="M17.6582 21H15.4662L14.5702 18.152H10.6022L9.72219 21H7.57819L11.3222 9.832H13.9462L17.6582 21ZM14.0582 16.344L12.6182 11.752H12.5382L11.1142 16.344H14.0582ZM23.9122 21H18.8402V19.304H20.3122V11.528H18.8402V9.832H23.9122V11.528H22.4242V19.304H23.9122V21Z"
            fill="#161616"
          />
        </g>
      </svg>
    </CarbonTooltip>
  );
}
