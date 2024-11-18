/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Button, IconButton, TextInput, Spacer } from '@instana/components';

import type {
  MappingRule,
  MappingRuleRowProps,
  RegexMappingRulesProps
} from 'in-websites/trackingSnippet/AutoPageTransitionDetection/types';
import { isValidRegex, defaultMappingRule } from 'in-websites/trackingSnippet/AutoPageTransitionDetection/constants';
import { t } from 'in-i18n';

import locals from 'in-websites/trackingSnippet/AutoPageTransitionDetection/AutoPageTransitionDetection.mless';

const RegexMappingRules = ({ setRegexMappingRules }: RegexMappingRulesProps) => {
  const [mappingRules, setMappingRules] = useState<MappingRule[]>([defaultMappingRule]);
  const [errors, setErrors] = useState<Record<number, { ruleError: string | null; replaceTextError: string | null }>>(
    {}
  );

  const updateRule = (id: number, field: keyof MappingRule, value: string) => {
    setMappingRules(prevRules => prevRules.map(rule => (rule.id === id ? { ...rule, [field]: value } : rule)));
  };

  const addRule = () => {
    const newRule = { ...defaultMappingRule, id: Date.now() };
    setMappingRules(prevRules => [...prevRules, newRule]);
    setErrors(prevErrors => ({
      ...prevErrors,
      [newRule.id]: { ruleError: null, replaceTextError: null }
    }));
  };

  const clearRule = (id: number) => {
    setMappingRules(prevRules =>
      prevRules.map(rule => (rule.id === id ? { ...rule, rule: '', replaceText: '' } : rule))
    );
  };

  const deleteRule = (id: number) => {
    setMappingRules(prevRules => prevRules.filter(rule => rule.id !== id));
    setErrors(prevErrors => {
      const { [id]: _, ...remainingErrors } = prevErrors;
      return remainingErrors;
    });
  };

  const saveAll = () => {
    const newErrors: Record<number, { ruleError: string | null; replaceTextError: string | null }> = {};
    let isValid = true;

    mappingRules.forEach(rule => {
      const ruleError =
        rule.rule.trim() === ''
          ? t('in-websites:trackingSnippet.autoPageTransition.emptyFieldValidationMessage')
          : !isValidRegex(rule.rule)
          ? t('in-websites:trackingSnippet.autoPageTransition.regexValidationMessage')
          : null;
      const replaceTextError =
        rule.replaceText.trim() === ''
          ? t('in-websites:trackingSnippet.autoPageTransition.emptyFieldValidationMessage')
          : null;

      if (ruleError || replaceTextError) {
        isValid = false;
        newErrors[rule.id] = { ruleError, replaceTextError };
      }
    });

    setErrors(newErrors);

    if (isValid) {
      setRegexMappingRules(mappingRules);
    }
  };

  return (
    <>
      <Spacer vertical="medium" />
      <div>
        {mappingRules.map(rule => (
          <MappingRuleRow
            key={rule.id}
            rule={rule}
            updateRule={updateRule}
            deleteRule={() => (mappingRules.length > 1 ? deleteRule(rule.id) : clearRule(rule.id))}
            isDeletable={mappingRules.length > 1}
            ruleError={errors[rule.id]?.ruleError}
            replaceTextError={errors[rule.id]?.replaceTextError}
          />
        ))}
      </div>

      <div className={locals.regexMappingRulesFooterWrapper}>
        <Button kind="action" icon="lib_openclose_add_circle_outline" onClick={addRule}>
          {t('in-websites:trackingSnippet.autoPageTransition.addLineButton')}
        </Button>

        <Button type="submit" kind="create" onClick={saveAll}>
          {t('in-websites:trackingSnippet.autoPageTransition.saveAllButton')}
        </Button>
      </div>
    </>
  );
};
const MappingRuleRow = ({
  rule,
  updateRule,
  deleteRule,
  isDeletable,
  ruleError,
  replaceTextError
}: MappingRuleRowProps) => (
  <>
    <div className={locals.mappingRuleRow}>
      <TextInput
        id="mapping-rule"
        type="text"
        value={rule.rule}
        placeholder={t('in-websites:trackingSnippet.autoPageTransition.mappingRuleLabel')}
        labelText={''}
        onChange={(e: any) => updateRule(rule.id, 'rule', e.target.value)}
        invalidText={ruleError}
        invalid={!!ruleError}
        helperText={t('in-websites:trackingSnippet.autoPageTransition.mappingRuleHelperText')}
      />
      <Spacer horizontal="medium" />
      <TextInput
        id="replaced-by"
        type="text"
        value={rule.replaceText}
        placeholder={t('in-websites:trackingSnippet.autoPageTransition.replacedByLabel')}
        labelText={''}
        onChange={(e: any) => updateRule(rule.id, 'replaceText', e.target.value)}
        invalidText={replaceTextError}
        invalid={!!replaceTextError}
        helperText={t('in-websites:trackingSnippet.autoPageTransition.replacedByHelperText')}
      />
      {isDeletable && (
        <IconButton
          kind="primary"
          type={'lib_actions_delete'}
          onClick={() => deleteRule(rule.id)}
          buttonType="button"
        />
      )}
    </div>
    <Spacer vertical="small" />
  </>
);

export default RegexMappingRules;
