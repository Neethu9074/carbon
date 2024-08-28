/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useCallback } from 'react';
import classNames from 'classnames';

import { AvailablePlugins, GetAvailablePluginsQuery, Result, TagFilterExpression } from '@instana/types';
import { IconButton, Button } from '@instana/components';
import { Observable } from '@instana/observables';

import RegexMetricList from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/RegexMetricList';
// @ts-expect-error needs to be converted
import { TypeSelector } from 'in-infrastructure/Explore/components/TypeSelector';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter/DangerousHtmlPresenter';
import RegexInput from 'in-components/RegexInput/RegexInput';
import Overlay from 'in-components/overlays/Overlay/Overlay';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { toHtml } from 'in-services/formatters/markdown';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/RegexMetricSelectorOverlay.mless';

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
          excludeAllType
        />
      </div>
      <div className={locals.wrapper}>
        <RegexInput
          autoFocus
          className={locals.input}
          placeholder={t('in-custom-dashboards:widgets.srcInfrastructure.regexMetricSelectorOverlay.inputPlaceholder')}
          value={debouncedRegex.value}
          onChange={value => debouncedRegex.onChange(value)}
          onEnter={done}
        />
        <Overlay content={HelpOverlay}>
          {({ toggle }) => (
            <IconButton
              kind="action"
              type="lib_help_error_help_outline"
              className={classNames(locals.icon, { [locals.clickable]: true })}
              onClick={toggle}
            />
          )}
        </Overlay>
      </div>
      <RegexMetricList
        tagFilterExpression={backendQueryModel}
        type={type}
        regex={debouncedRegex.debouncedValue}
        size={100}
      />
      <Button className={locals.button} kind="action" disabled={!type} onClick={done}>
        {t('in-custom-dashboards:widgets.srcInfrastructure.regexMetricSelectorOverlay.done')}
      </Button>
    </div>
  );
}

const documentationLink =
  'https://www.ibm.com/docs/en/instana-observability/current?topic=dashboards-example-infrastructure';

function HelpOverlay() {
  return (
    <DangerousHtmlPresenter
      className={locals.helpOverlay}
      html={toHtml(
        t('in-custom-dashboards:widgets.srcInfrastructure.regexMetricSelectorOverlay.help', { documentationLink })
      )}
    />
  );
}
