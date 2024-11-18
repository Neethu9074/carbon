/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { RadioButton, Spacer, Typography } from '@instana/components';

import {
  pageTransitionMethods,
  applicationFrameworkURL,
  frameworkTypes
} from 'in-websites/trackingSnippet/AutoPageTransitionDetection/constants';
import AutoPageTransitionDetection from 'in-websites/trackingSnippet/AutoPageTransitionDetection/AutoPageTransitionDetection';
import type { FrameworkTypeSelectionProps } from 'in-websites/trackingSnippet/AutoPageTransitionDetection/types';
import { LearnMoreLink } from 'in-websites/trackingSnippet/AutoPageTransitionDetection/utils';
import { t } from 'in-i18n';

import locals from 'in-websites/trackingSnippet/AutoPageTransitionDetection/AutoPageTransitionDetection.mless';

const FrameworkTypeSelection = ({
  frameworkType,
  setFrameworkType,
  enableAutoPageDetection,
  setEnableAutoPageDetection,
  pageTransitionMethod,
  setPageTransitionMethod,
  setRegexMappingRules
}: FrameworkTypeSelectionProps) => {
  const handleFrameworkChange = (type: string) => {
    setFrameworkType(type);
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
      <Spacer vertical="normal" />
      <div className={locals.wrapper}>
        <Typography variant="body-small" component="p" noMargin align="inherit">
          {t('in-websites:trackingSnippet.autoPageTransition.frameworkTypeSelectionLabel')}
        </Typography>
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
              labelClassName={locals.neutralSmallText}
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
        />
      )}
    </>
  );
};

export default FrameworkTypeSelection;
