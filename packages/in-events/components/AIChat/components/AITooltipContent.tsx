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

/**
 * AITooltipContent component displays information about the AI Chat
 * including Watson X information, preview disclaimer, and model details
 */
export const AITooltipContent = () => {
  return (
    <>
      {/*IBM watsonx information */}
      <div className={locals.watsonXInfo}>
        <Typography variant="helper-text-02">
          <div className={locals.secondaryTitle}> {t('in-events:aichat.aiExplained')}</div>
        </Typography>
        <Typography variant="heading-03" noMargin>
          {t('in-events:aichat.poweredByWatsonX')}
        </Typography>
        <Typography variant="body-01">
          <div className={locals.secondaryTitle}> {t('in-events:aichat.watsonXDesc')}</div>
        </Typography>
      </div>

      {/* Preview disclaimer section */}
      <div className={locals.previewDisclaimer}>
        <Typography variant="body-01">
          <div className={locals.secondaryTitle}> {t('in-events:aichat.previewDisclaimer')}</div>
        </Typography>
      </div>

      {/* Model details section */}
      <div className={locals.modelSection}>
        <Typography variant="helper-text-02">
          <div className={locals.secondaryTitle}> {t('in-events:aichat.aiModel')}</div>
        </Typography>
        {/* Creating a clickable span styled as a link since link component is having propogation issues */}
        <span
          className={locals.graniteLink}
          onClick={e => {
            e.stopPropagation();
            window.open('https://huggingface.co/ibm-granite/granite-3.3-8b-instruct', '_blank', 'noopener,noreferrer');
          }}
        >
          {t('in-events:aichat.granite')}
          <Launch className={locals.launchIcon} size={16} />
        </span>
      </div>
    </>
  );
};

export default AITooltipContent;
