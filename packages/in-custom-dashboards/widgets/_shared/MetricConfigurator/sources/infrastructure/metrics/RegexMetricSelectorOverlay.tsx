/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useCallback } from 'react';

import { AvailablePlugins, GetAvailablePluginsQuery, Result, TagFilterExpression } from '@instana/types';
import { Observable } from '@instana/observables';
import { keyCodes } from '@instana/components';
import { Button } from '@instana/components';

// @ts-expect-error needs to be converted
import { TypeSelector } from 'in-infrastructure/Explore/components/TypeSelector';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import Input from 'in-components/form/Input/Input';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/RegexMetricSelectorOverlay.mless';

const { isReturn } = keyCodes;

export interface Props {
  backendQueryModel: TagFilterExpression;
  regex: string;
  onRegexChange: (query: string) => void;
  type: string;
  onTypeChange: (type: string) => void;
  close?: () => void;
  getAvailablePlugins?: GetAvailablePluginsFn;
}

export type GetAvailablePluginsFn = (query: GetAvailablePluginsQuery) => Observable<Result<AvailablePlugins>>;

export default function RegexMetricSelectorOverlay({
  regex,
  onRegexChange,
  backendQueryModel,
  type,
  onTypeChange,
  close,
  getAvailablePlugins
}: Props) {
  const debouncedRegex = useDebouncedValue(regex, onRegexChange);
  const done = useCallback(() => {
    onRegexChange(debouncedRegex.value);
    close?.();
  }, [onRegexChange, debouncedRegex.value, close]);

  return (
    <div className={locals.container}>
      <div className={locals.wrapper}>
        <TypeSelector
          className={locals.typeSelector}
          tagFilterExpression={backendQueryModel}
          type={type}
          onTypeChange={onTypeChange}
          getAvailablePlugins={getAvailablePlugins}
        />
      </div>
      <div className={locals.wrapper}>
        <Input
          autoFocus
          className={locals.input}
          type="search"
          placeholder={t('in-custom-dashboards:widgets.srcInfrastructure.regexMetricSelectorOverlay.inputPlaceholder')}
          value={debouncedRegex.value}
          onChange={e => debouncedRegex.onChange(e.target.value)}
          onKeyDown={e => {
            if (isReturn(e)) {
              done();
            }
          }}
        />
      </div>
      <Button kind="action" onClick={done}>
        {t('in-custom-dashboards:widgets.srcInfrastructure.regexMetricSelectorOverlay.done')}
      </Button>
    </div>
  );
}
