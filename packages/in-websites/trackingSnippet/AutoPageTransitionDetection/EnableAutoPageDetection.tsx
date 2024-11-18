/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { RadioButton, Toggle, Spacer, Typography } from '@instana/components';

import type {
  EnableAutoPageDetectionProps,
  EnableRegexMappingRuleProps
} from 'in-websites/trackingSnippet/AutoPageTransitionDetection/types';
import RegexMappingRules from 'in-websites/trackingSnippet/AutoPageTransitionDetection/RegexMappingRules';
import { pageTransitionMethods } from 'in-websites/trackingSnippet/AutoPageTransitionDetection/constants';
import { t } from 'in-i18n';

import locals from 'in-websites/trackingSnippet/AutoPageTransitionDetection/AutoPageTransitionDetection.mless';

const EnableAutoPageDetection = ({
  pageTransitionMethod,
  setPageTransitionMethod,
  setRegexMappingRules
}: EnableAutoPageDetectionProps) => {
  const handleRadioChange = (method: string, resetRules = false) => {
    setPageTransitionMethod(method);
    if (resetRules) setRegexMappingRules([]);
  };
  return (
    <>
      <Spacer vertical="normal" />
      <Typography variant="body-small" component="p" noMargin align="inherit">
        {t('in-websites:trackingSnippet.autoPageTransition.transitionDetectionHeading')}
      </Typography>
      <div className={locals.radioButtonWrapper}>
        {Object.values(pageTransitionMethods).map((method, index) => (
          <RadioButton
            key={method}
            label={
              method === pageTransitionMethods.PAGE_TITLE
                ? t('in-websites:trackingSnippet.autoPageTransition.pageTitleLabel')
                : t('in-websites:trackingSnippet.autoPageTransition.pageUrlLabel')
            }
            explanation={
              method === pageTransitionMethods.PAGE_TITLE
                ? t('in-websites:trackingSnippet.autoPageTransition.pageTitleDesc')
                : t('in-websites:trackingSnippet.autoPageTransition.pageUrlDesc')
            }
            checked={pageTransitionMethod === method}
            onChange={() => handleRadioChange(method, index === 0)}
            labelClassName={locals.neutralSmallText}
          />
        ))}
      </div>
      {pageTransitionMethod === pageTransitionMethods.PAGE_URL && (
        <EnableRegexMappingRule setRegexMappingRules={setRegexMappingRules} />
      )}
    </>
  );
};

const EnableRegexMappingRule = ({ setRegexMappingRules }: EnableRegexMappingRuleProps) => {
  const [enableRegexMappingRule, setEnableRegexMappingRule] = useState(false);

  const toggleRegexMappingRule = (enabled: boolean) => {
    setEnableRegexMappingRule(enabled);
    if (!enabled) setRegexMappingRules([]);
  };
  return (
    <>
      <Spacer vertical="medium" />
      <Typography variant="body-small" component="p" noMargin align="inherit">
        {t('in-websites:trackingSnippet.autoPageTransition.mappingRulesTitle')}
      </Typography>
      <Spacer vertical="xxsmall" />
      <Toggle
        id="enableRegexMappingRule"
        checked={enableRegexMappingRule}
        onToggle={toggleRegexMappingRule}
        className={locals.toggle}
        labelA={t('in-websites:trackingSnippet.trackingSnippetPresenterToggleNo')}
        labelB={t('in-websites:trackingSnippet.trackingSnippetPresenterToggleYes')}
      />
      <Typography variant="body-small" component="p" noMargin align="inherit">
        {t('in-websites:trackingSnippet.autoPageTransition.mappingRulesDesc')}
      </Typography>
      {enableRegexMappingRule && <RegexMappingRules setRegexMappingRules={setRegexMappingRules} />}
    </>
  );
};

export default EnableAutoPageDetection;
