/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import {
  ua2FacetedSearchSyntheticCallsToggledTracker,
  ua2FacetedSearchInternalCallsToggledTracker
} from 'in-applications/tracker';
import FacetedExpandableCard from 'in-applications/analyze/components/FacetedSearch/FacetedExpandableCard';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './Suggestion.mless';

export default function FacetedFilterHiddenCalls({
  title,
  formModel,
  includeSynthetic = false,
  includeInternal = false,
  setIncludeSynthetic,
  setIncludeInternal,
  dataSource,
  openByDefault
}) {
  const [isSyntheticAutoEnabled, setSyntheticAutoEnabled] = useState(false);
  const [isInternalAutoEnabled, setInternalAutoEnabled] = useState(false);

  const hasIsSynthetic = formModel.some(
    ({ name, operator, value }) => name === 'call.is_synthetic' && operator === EQUALS && value === true
  );
  const hasIsInternal = formModel.some(
    ({ name, operator, value }) => name === 'call.type' && operator === EQUALS && value === 'INTERNAL'
  );

  useEffect(() => {
    if (hasIsSynthetic) {
      setSyntheticAutoEnabled(!includeSynthetic);
      setIncludeSynthetic(true);
    } else {
      if (isSyntheticAutoEnabled) {
        setIncludeSynthetic(false);
        setSyntheticAutoEnabled(false);
      }
    }
  }, [hasIsSynthetic]);

  useEffect(() => {
    if (hasIsInternal) {
      setInternalAutoEnabled(!includeInternal);
      setIncludeInternal(true);
    } else {
      if (isInternalAutoEnabled) {
        setIncludeInternal(false);
        setInternalAutoEnabled(false);
      }
    }
  }, [hasIsInternal]);

  return (
    <FacetedExpandableCard title={title} openByDefault={openByDefault} tag={'hiddenCalls'} dataSource={dataSource}>
      <HiddenCallCheck
        label={t('in-applications:analyze.facetedSearch.showSyntheticCalls')}
        checked={includeSynthetic || hasIsSynthetic}
        disabled={hasIsSynthetic}
        onChange={() => {
          ua2FacetedSearchSyntheticCallsToggledTracker({ dataSource, value: !includeSynthetic });
          setIncludeSynthetic(!includeSynthetic);
        }}
        disabledTooltipContent={t('in-applications:analyze.facetedSearch.defaultTurnedOnSynthetic')}
      />
      <HiddenCallCheck
        label={t('in-applications:analyze.facetedSearch.showInternalCalls')}
        checked={includeInternal || hasIsInternal}
        disabled={hasIsInternal}
        onChange={() => {
          ua2FacetedSearchInternalCallsToggledTracker({ dataSource, value: !includeInternal });
          setIncludeInternal(!includeInternal);
        }}
        disabledTooltipContent={t('in-applications:analyze.facetedSearch.defaultTurnedOnInternal')}
      />
    </FacetedExpandableCard>
  );
}

function HiddenCallCheck({ label, checked, onChange, disabled, disabledTooltipContent }) {
  return (
    <Tooltip content={disabled && disabledTooltipContent} align="topMiddle" delay={500}>
      <div
        className={classNames({
          [locals.suggestion]: true,
          [locals.suggestionDisabled]: disabled
        })}
      >
        <CheckboxFancy
          labelClassName={locals.label}
          wrapperClassName={locals.checkboxWrapper}
          label={label}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </Tooltip>
  );
}
