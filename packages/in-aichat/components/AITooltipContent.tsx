/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Launch } from '@carbon/icons-react';
import React from 'react';

import { Typography } from '@instana/components';

import { t } from 'in-i18n';

import locals from '../AIChat.mless';

interface AiTooltipProps {
  model: string;
}

/**
 * AITooltipContent component displays information about the AI Chat
 * including Watson X information, preview disclaimer, and model details
 */
export const AITooltipContent = ({ model }: AiTooltipProps) => {
  return (
    <>
      {/*IBM watsonx information */}
      <div className={locals.watsonXInfo}>
        <Typography variant="helper-text-02">
          <div className={locals.secondaryTitle}> {t('in-aichat:aichat.aiExplained')}</div>
        </Typography>
        <Typography variant="heading-03" noMargin>
          {t('in-aichat:aichat.poweredByWatsonX')}
        </Typography>
        <Typography variant="body-01">
          <div className={locals.secondaryTitle}> {t('in-aichat:aichat.watsonXDesc')}</div>
        </Typography>
      </div>

      {/* Preview disclaimer section */}
      <div className={locals.previewDisclaimer}>
        <Typography variant="body-01">
          <div className={locals.secondaryTitle}> {t('in-aichat:aichat.previewDisclaimer')}</div>
        </Typography>
      </div>

      {/* Model details section */}
      <div className={locals.modelSection}>
        <Typography variant="helper-text-02">
          <div className={locals.secondaryTitle}> {t('in-aichat:aichat.aiModel')}</div>
        </Typography>
        {/* Creating a clickable span styled as a link since link component is having propogation issues */}
        <span
          className={locals.graniteLink}
          onClick={e => {
            e.stopPropagation();
            window.open('https://www.ibm.com/products/watsonx-ai/foundation-models', '_blank', 'noopener,noreferrer');
          }}
        >
          {model}
          <Launch className={locals.launchIcon} size={16} />
        </span>
      </div>
    </>
  );
};

export default AITooltipContent;
