/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { RadioButton, Toggle, Spacer } from '@instana/components';

import type {
  MappingRule,
  EnableAutoPageDetectionProps,
  EnableRegexMappingRuleProps
} from 'in-websites/trackingSnippet/AutoPageTransitionDetection/types';
import {
  LearnMoreLink,
  SubHeading,
  SubHeadingHelpText
} from 'in-websites/trackingSnippet/AutoPageTransitionDetection/utils';
import {
  mappingRuleURL,
  pageTransitionMethods
} from 'in-websites/trackingSnippet/AutoPageTransitionDetection/constants';
import DisableRegexMappingModal from 'in-websites/trackingSnippet/AutoPageTransitionDetection/DisableRegexMappingModal';
import RegexMappingRules from 'in-websites/trackingSnippet/AutoPageTransitionDetection/RegexMappingRules';
import { defaultMappingRule } from 'in-websites/trackingSnippet/AutoPageTransitionDetection/constants';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

import locals from 'in-websites/trackingSnippet/AutoPageTransitionDetection/AutoPageTransitionDetection.mless';

const EnableAutoPageDetection = ({
  pageTransitionMethod,
  setPageTransitionMethod,
  setRegexMappingRules,
  setWithoutCopyButton
}: EnableAutoPageDetectionProps) => {
  const handleRadioChange = (method: string, resetRules = false) => {
    setPageTransitionMethod(method);
    setWithoutCopyButton(false);
    if (resetRules) setRegexMappingRules([]);
  };
  return (
    <>
      <Spacer vertical="large" />
      <SubHeading text={t('in-websites:trackingSnippet.autoPageTransition.transitionDetectionHeading')} />
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
          />
        ))}
      </div>
      {pageTransitionMethod === pageTransitionMethods.PAGE_URL && (
        <EnableRegexMappingRule
          setRegexMappingRules={setRegexMappingRules}
          setWithoutCopyButton={setWithoutCopyButton}
        />
      )}
    </>
  );
};

const EnableRegexMappingRule = ({ setRegexMappingRules, setWithoutCopyButton }: EnableRegexMappingRuleProps) => {
  const [mappingRules, setMappingRules] = useState<MappingRule[]>([defaultMappingRule]);
  const [enableRegexMappingRule, setEnableRegexMappingRule] = useState(false);
  const hasChanges = mappingRules.some(rule => rule.rule.trim() !== '' || rule.replaceText.trim() !== '');

  const toggleRegexMappingRule = (isEnabled: boolean) => {
    const resetMappingRules = () => {
      setWithoutCopyButton(false);
      setEnableRegexMappingRule(isEnabled);
      setMappingRules([defaultMappingRule]);
      setRegexMappingRules([]);
    };

    const showDisableModal = () => {
      addActiveDialog(
        <DisableRegexMappingModal
          modalTitle={t('in-websites:trackingSnippet.autoPageTransition.regexMappingModalHeading')}
          modalBody={t('in-websites:trackingSnippet.autoPageTransition.regexMappingModalDesc')}
          modalBodyLastLine={t('in-websites:trackingSnippet.autoPageTransition.regexMappingModalText')}
          primaryButtonText={t('in-websites:trackingSnippet.autoPageTransition.regexMappingModalDisableButton')}
          secondaryButtonText={t('in-websites:trackingSnippet.autoPageTransition.regexMappingModalCancelButton')}
          onSubmit={resetMappingRules}
        />
      );
    };

    if (isEnabled) {
      setEnableRegexMappingRule(true);
      return;
    }

    if (hasChanges) {
      showDisableModal();
    } else {
      resetMappingRules();
    }
  };

  return (
    <>
      <Spacer vertical="large" />
      <SubHeading text={t('in-websites:trackingSnippet.autoPageTransition.mappingRulesTitle')} />
      <Toggle
        id="enableRegexMappingRule"
        checked={enableRegexMappingRule}
        onToggle={toggleRegexMappingRule}
        className={locals.toggle}
        labelA={t('in-websites:trackingSnippet.trackingSnippetPresenterToggleNo')}
        labelB={t('in-websites:trackingSnippet.trackingSnippetPresenterToggleYes')}
      />
      <Spacer vertical="xsmall" />
      <SubHeadingHelpText text={t('in-websites:trackingSnippet.autoPageTransition.mappingRulesDesc')} />
      <LearnMoreLink
        label={t('in-websites:trackingSnippet.autoPageTransition.learnMoreAboutText')}
        linkText={t('in-websites:trackingSnippet.autoPageTransition.mappingRulesLinkText')}
        url={mappingRuleURL}
      />
      {enableRegexMappingRule && (
        <RegexMappingRules
          mappingRules={mappingRules}
          setMappingRules={setMappingRules}
          setRegexMappingRules={setRegexMappingRules}
          setWithoutCopyButton={setWithoutCopyButton}
        />
      )}
    </>
  );
};

export default EnableAutoPageDetection;
