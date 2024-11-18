/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Toggle, Spacer, Typography } from '@instana/components';

import {
  pageTransitionMethods,
  autoDetectionURL
} from 'in-websites/trackingSnippet/AutoPageTransitionDetection/constants';
import type { AutoPageTransitionDetectionProps } from 'in-websites/trackingSnippet/AutoPageTransitionDetection/types';
import EnableAutoPageDetection from 'in-websites/trackingSnippet/AutoPageTransitionDetection/EnableAutoPageDetection';
import { LearnMoreLink } from 'in-websites/trackingSnippet/AutoPageTransitionDetection/utils';
import { t } from 'in-i18n';

import locals from 'in-websites/trackingSnippet/AutoPageTransitionDetection/AutoPageTransitionDetection.mless';

const AutoPageTransitionDetection = ({
  enableAutoPageDetection,
  setEnableAutoPageDetection,
  pageTransitionMethod,
  setPageTransitionMethod,
  setRegexMappingRules
}: AutoPageTransitionDetectionProps) => {
  const handleToggle = (enabled: boolean) => {
    setEnableAutoPageDetection(enabled);
    setPageTransitionMethod(pageTransitionMethods.PAGE_TITLE);
    setRegexMappingRules([]);
  };

  return (
    <div className={locals.autoDetectBlockWrapper}>
      <Spacer vertical="medium" />
      <Typography variant="body-small" component="p" noMargin align="inherit">
        {t('in-websites:trackingSnippet.autoPageTransition.enableAutopageTransitionLabel')}
      </Typography>
      <Spacer vertical="xxsmall" />
      <Toggle
        id="enableAutoPageDetection"
        checked={enableAutoPageDetection}
        onToggle={handleToggle}
        className={locals.toggle}
        labelA={t('in-websites:trackingSnippet.trackingSnippetPresenterToggleNo')}
        labelB={t('in-websites:trackingSnippet.trackingSnippetPresenterToggleYes')}
      />
      <Spacer vertical="small" />
      <Typography variant="body-small" component="p" noMargin align="inherit">
        {t('in-websites:trackingSnippet.autoPageTransition.enableAutopageTransitionDesc')}
      </Typography>
      <LearnMoreLink
        label={t('in-websites:trackingSnippet.autoPageTransition.learnMoreAboutText')}
        linkText={t('in-websites:trackingSnippet.autoPageTransition.autoDetectionText')}
        url={autoDetectionURL}
      />

      {enableAutoPageDetection && (
        <EnableAutoPageDetection
          pageTransitionMethod={pageTransitionMethod}
          setPageTransitionMethod={setPageTransitionMethod}
          setRegexMappingRules={setRegexMappingRules}
        />
      )}
    </div>
  );
};

export default AutoPageTransitionDetection;
