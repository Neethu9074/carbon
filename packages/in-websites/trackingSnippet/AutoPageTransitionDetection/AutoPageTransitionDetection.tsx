/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Toggle, Spacer } from '@instana/components';

import {
  LearnMoreLink,
  SubHeading,
  SubHeadingHelpText
} from 'in-websites/trackingSnippet/AutoPageTransitionDetection/utils';
import {
  pageTransitionMethods,
  autoDetectionURL
} from 'in-websites/trackingSnippet/AutoPageTransitionDetection/constants';
import type { AutoPageTransitionDetectionProps } from 'in-websites/trackingSnippet/AutoPageTransitionDetection/types';
import EnableAutoPageDetection from 'in-websites/trackingSnippet/AutoPageTransitionDetection/EnableAutoPageDetection';
import { t } from 'in-i18n';

import locals from 'in-websites/trackingSnippet/AutoPageTransitionDetection/AutoPageTransitionDetection.mless';

const AutoPageTransitionDetection = ({
  enableAutoPageDetection,
  setEnableAutoPageDetection,
  pageTransitionMethod,
  setPageTransitionMethod,
  setRegexMappingRules,
  setWithoutCopyButton
}: AutoPageTransitionDetectionProps) => {
  const handleToggle = (enabled: boolean) => {
    setEnableAutoPageDetection(enabled);
    setWithoutCopyButton(false);
    setPageTransitionMethod(pageTransitionMethods.PAGE_TITLE);
    setRegexMappingRules([]);
  };

  return (
    <div className={locals.autoDetectBlockWrapper}>
      <Spacer vertical="medium" />
      <SubHeading text={t('in-websites:trackingSnippet.autoPageTransition.enableAutopageTransitionLabel')} />
      <Toggle
        id="enableAutoPageDetection"
        checked={enableAutoPageDetection}
        onToggle={handleToggle}
        labelA={t('in-websites:trackingSnippet.trackingSnippetPresenterToggleNo')}
        labelB={t('in-websites:trackingSnippet.trackingSnippetPresenterToggleYes')}
      />
      <SubHeadingHelpText text={t('in-websites:trackingSnippet.autoPageTransition.enableAutopageTransitionDesc')} />
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
          setWithoutCopyButton={setWithoutCopyButton}
        />
      )}
    </div>
  );
};

export default AutoPageTransitionDetection;
