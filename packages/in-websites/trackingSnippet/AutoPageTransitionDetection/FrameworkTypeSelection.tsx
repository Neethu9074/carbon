/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { RadioButton, Spacer } from '@instana/components';

import {
  pageTransitionMethods,
  applicationFrameworkURL,
  frameworkTypes
} from 'in-websites/trackingSnippet/AutoPageTransitionDetection/constants';
import AutoPageTransitionDetection from 'in-websites/trackingSnippet/AutoPageTransitionDetection/AutoPageTransitionDetection';
import type { FrameworkTypeSelectionProps } from 'in-websites/trackingSnippet/AutoPageTransitionDetection/types';
import { LearnMoreLink, SubHeading } from 'in-websites/trackingSnippet/AutoPageTransitionDetection/utils';
import { t } from 'in-i18n';

import locals from 'in-websites/trackingSnippet/AutoPageTransitionDetection/AutoPageTransitionDetection.mless';

const FrameworkTypeSelection = ({
  frameworkType,
  setFrameworkType,
  enableAutoPageDetection,
  setEnableAutoPageDetection,
  pageTransitionMethod,
  setPageTransitionMethod,
  setRegexMappingRules,
  setWithoutCopyButton
}: FrameworkTypeSelectionProps) => {
  const handleFrameworkChange = (type: string) => {
    setFrameworkType(type);
    setWithoutCopyButton(false);
    switch (type) {
      case frameworkTypes.MPA:
        setRegexMappingRules([]);
        setPageTransitionMethod(pageTransitionMethods.PAGE_TITLE);
        break;
      case frameworkTypes.SPA:
        setEnableAutoPageDetection(true);
        break;
      default:
        break;
    }
  };
  return (
    <>
      <Spacer vertical="large" />
      <div className={locals.wrapper}>
        <SubHeading text={t('in-websites:trackingSnippet.autoPageTransition.frameworkTypeSelectionLabel')} />
        <div className={locals.radioButtonWrapper}>
          {Object.values(frameworkTypes).map(type => (
            <RadioButton
              key={type}
              label={
                type === frameworkTypes.MPA
                  ? t('in-websites:trackingSnippet.autoPageTransition.mpaLabel')
                  : t('in-websites:trackingSnippet.autoPageTransition.spaLabel')
              }
              checked={frameworkType === type}
              onChange={() => handleFrameworkChange(type)}
            />
          ))}
        </div>
        <LearnMoreLink
          label={t('in-websites:trackingSnippet.autoPageTransition.learnMoreAboutText')}
          linkText={t('in-websites:trackingSnippet.autoPageTransition.applicationFrameworkText')}
          url={applicationFrameworkURL}
        />
      </div>
      {frameworkType === frameworkTypes.SPA && (
        <AutoPageTransitionDetection
          enableAutoPageDetection={enableAutoPageDetection}
          setEnableAutoPageDetection={setEnableAutoPageDetection}
          pageTransitionMethod={pageTransitionMethod}
          setPageTransitionMethod={setPageTransitionMethod}
          setRegexMappingRules={setRegexMappingRules}
          setWithoutCopyButton={setWithoutCopyButton}
        />
      )}
    </>
  );
};

export default FrameworkTypeSelection;
