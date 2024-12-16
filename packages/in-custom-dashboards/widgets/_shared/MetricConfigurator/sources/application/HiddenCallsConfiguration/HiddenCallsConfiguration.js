/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Spacer, Toggle } from '@instana/components';

import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

import locals from './HiddenCallsConfiguration.mless';

export default function HiddenCallsConfiguration({
  includeInternal,
  includeSynthetic,
  onIncludeInternalChange,
  onIncludeSyntheticChange
}) {
  return (
    <Section useAlternateBg>
      <div className={locals.wrapper}>
        <Toggle
          className={locals.toggle}
          id="select-hidden-calls-internal"
          checked={includeInternal}
          onToggle={e => onIncludeInternalChange(e)}
        />
        <Spacer horizontal="xxsmall" />
        <span className={locals.label}>
          {t('in-custom-dashboards:widgets.metricConfig.hiddenCalls.includeInternalCalls')}
        </span>
        <Spacer horizontal="xxsmall" />
        <Toggle
          id="select-hidden-calls-synthetic"
          checked={includeSynthetic}
          onToggle={e => onIncludeSyntheticChange(e)}
        />
        <Spacer horizontal="xxsmall" />
        <span className={locals.label}>
          {t('in-custom-dashboards:widgets.metricConfig.hiddenCalls.includeSyntheticCalls')}
        </span>
      </div>
    </Section>
  );
}

HiddenCallsConfiguration.propTypes = {
  includeInternal: PropTypes.bool.isRequired,
  includeSynthetic: PropTypes.bool.isRequired,
  onIncludeInternalChange: PropTypes.func.isRequired,
  onIncludeSyntheticChange: PropTypes.func.isRequired
};
