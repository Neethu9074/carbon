/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ActionType } from '@instana/types';

import { ACTION_TYPE, ACTION_TRANSLATIONS } from 'in-automation/constants';
import ComboBox, { Option } from 'in-components/ComboBox/ComboBox';
import useActionFilter from 'in-automation/hooks/useActionFilter';
import { hasError, isLoading } from 'in-services/util/result';
import { compareIgnoreCase } from 'in-services/util/string';
import { ActionFilter } from 'in-automation/types';
import { t } from 'in-i18n';

const mapToOption = (type: ActionType): Option => ({ value: type, label: ACTION_TRANSLATIONS[type] });

const baseOptions = [
  ACTION_TYPE.SCRIPT,
  ACTION_TYPE.HTTP,
  ACTION_TYPE.ANSIBLE,
  ACTION_TYPE.GITHUB,
  ACTION_TYPE.GITLAB,
  ACTION_TYPE.JIRA
].map(mapToOption);

const DocManualOptions = [ACTION_TYPE.DOC_LINK, ACTION_TYPE.MANUAL].map(mapToOption);

const externalOption = mapToOption(ACTION_TYPE.EXTERNAL);

interface TypeFilterProps {
  type: string[] | undefined;
  setType: (params: { types: string[] | undefined }) => void;
  showExternal?: boolean;
  showRunnable?: boolean;
}

function filterTypes(actionFilter: 'all' | ActionFilter, options: Option[]) {
  if (actionFilter === 'all' || actionFilter.types.length === 0) {
    return options;
  } else {
    return options.filter(({ value }) => actionFilter.types.includes(value as ActionType));
  }
}
export function TypeFilter({ type, setType, showExternal = false, showRunnable = false }: TypeFilterProps) {
  const actionFilter = useActionFilter();
  const options = [...baseOptions];
  if (!showRunnable) options.push(...DocManualOptions);
  if (showExternal) options.push(externalOption);
  const filteredOptions =
    isLoading(actionFilter) || hasError(actionFilter)
      ? []
      : filterTypes(actionFilter.data!, options).sort((a, b) => compareIgnoreCase(a.label, b.label));

  return (
    <ComboBox
      disabled={isLoading(actionFilter)}
      options={filteredOptions}
      placeholder={t('in-automation:type')}
      value={type}
      isMulti
      onChange={newValue => {
        if (!newValue) {
          setType({ types: undefined });
        } else {
          if (Array.isArray(newValue)) {
            setType({ types: newValue.map(a => a.value) });
          }
        }
      }}
    />
  );
}

interface AiEngineFilterProps {
  aiEngine: string | null;
  setAiEngine: (type: string | null) => void;
  availableAiEngines: string[];
}

export function AiEngineFilter({ aiEngine, setAiEngine, availableAiEngines }: AiEngineFilterProps) {
  return (
    <ComboBox
      options={availableAiEngines.map(engine => ({ value: engine, label: engine }))}
      placeholder={t('in-automation:engine')}
      value={aiEngine}
      onChange={newValue => {
        if (!newValue) {
          setAiEngine(null);
        } else {
          // @ts-expect-error
          setAiEngine(newValue.value);
        }
      }}
    />
  );
}
