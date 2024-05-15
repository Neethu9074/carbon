/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

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
import { compareIgnoreCase } from 'in-services/util/string';
import ComboBox from 'in-components/ComboBox/ComboBox';
import { t } from 'in-i18n';

const baseOptions = [
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
  type: string | null;
  setType: (type: string | null) => void;
  showExternal?: boolean;
}

export function TypeFilter({ type, setType, showExternal = false }: TypeFilterProps) {
  const options = [...baseOptions].sort((a, b) => compareIgnoreCase(a.label, b.label));
  if (showExternal) options.push(externalOption);

  return (
    <ComboBox
      options={options}
      placeholder={t('in-automation:type')}
      value={type}
      onChange={newValue => {
        if (!newValue) {
          setType(null);
        } else {
          // @ts-expect-error
          setType(newValue.value);
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
