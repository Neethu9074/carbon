/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ActionType } from '@instana/types';

import {
  ANSIBlE_TYPE,
  DOC_LINK_TYPE,
  EXTERNAL_TYPE,
  GITHUB_TYPE,
  GITLAB_TYPE,
  JIRA_TYPE,
  MANUAL_TYPE,
  SCRIPT_TYPE,
  WEBHOOK_TYPE
} from 'in-automation/ActionCatalog/shared';
import ComboBox, { Option } from 'in-components/ComboBox/ComboBox';
import useActionFilter from 'in-automation/hooks/useActionFilter';
import { hasError, isLoading } from 'in-services/util/result';
import { compareIgnoreCase } from 'in-services/util/string';
import { ActionFilter } from 'in-automation/api';
import { t } from 'in-i18n';

const baseOptions: Option[] = [
  { value: DOC_LINK_TYPE, label: t('in-automation:ActionCatalog.docLink') },
  { value: SCRIPT_TYPE, label: t('in-automation:ActionCatalog.script') },
  { value: WEBHOOK_TYPE, label: t('in-automation:ActionCatalog.http') },
  { value: MANUAL_TYPE, label: t('in-automation:ActionCatalog.manual') },
  { value: ANSIBlE_TYPE, label: t('in-automation:ActionCatalog.ansible') },
  { value: GITHUB_TYPE, label: t('in-automation:ActionCatalog.github') },
  { value: GITLAB_TYPE, label: t('in-automation:ActionCatalog.gitlab') },
  { value: JIRA_TYPE, label: t('in-automation:ActionCatalog.jira') }
];

const externalOption = { value: EXTERNAL_TYPE, label: t('in-automation:actionHistory.external') };

interface TypeFilterProps {
  type: string[] | undefined;
  setType: (params: { types: string[] | undefined }) => void;
  showExternal?: boolean;
}

function filterTypes(actionFilter: 'all' | ActionFilter, options: Option[]) {
  if (actionFilter === 'all' || actionFilter.types.length === 0) {
    return options;
  } else {
    return options.filter(({ value }) => actionFilter.types.includes(value as ActionType));
  }
}
export function TypeFilter({ type, setType, showExternal = false }: TypeFilterProps) {
  const actionFilter = useActionFilter();
  const options = [...baseOptions];
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
