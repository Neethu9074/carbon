/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';

import { Stack, Checkbox } from '@instana/components';

import FacetedExpandableCard from 'in-components/AnalyzeView/FacetedFilters/FacetedExpandableCard';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { useAnalyzeTracker } from 'in-analyze/hooks/useAnalyzeTracker';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './FacetedFilterHiddenCalls.mless';

export default function FacetedFilterHiddenCalls({
  title,
  formModel,
  formModelWithFacets,
  includeSynthetic = false,
  includeInternal = false,
  setIncludeSynthetic,
  setIncludeInternal,
  dataSource,
  openByDefault
}) {
  const [isSyntheticAutoEnabled, setSyntheticAutoEnabled] = useState(false);
  const [isInternalAutoEnabled, setInternalAutoEnabled] = useState(false);

  const hasIsSynthetic = (formModelWithFacets ?? formModel).some(
    ({ name, operator, value }) => name === 'call.is_synthetic' && operator === EQUALS && value === true
  );
  const hasIsInternal = (formModelWithFacets ?? formModel).some(
    ({ name, operator, value }) => name === 'call.type' && operator === EQUALS && value === 'INTERNAL'
  );
  const { trackUa2FacetedSearchSyntheticCallsToggled, trackUa2FacetedSearchInternalCallsToggled } = useAnalyzeTracker();
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
    // trigger only when hasIsSynthetic is changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // trigger only when hasIsInternal is changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasIsInternal]);

  return (
    <FacetedExpandableCard title={title} openByDefault={openByDefault} tag={'hiddenCalls'} dataSource={dataSource}>
      <Stack gap="xxsmall">
        <HiddenCallCheck
          label={t('in-applications:analyze.facetedSearch.showSyntheticCalls')}
          checked={includeSynthetic || hasIsSynthetic}
          disabled={hasIsSynthetic}
          onChange={() => {
            trackUa2FacetedSearchSyntheticCallsToggled({ dataSource, value: !includeSynthetic });
            setIncludeSynthetic(!includeSynthetic);
          }}
          disabledTooltipContent={t('in-applications:analyze.facetedSearch.defaultTurnedOnSynthetic')}
        />
        <HiddenCallCheck
          label={t('in-applications:analyze.facetedSearch.showInternalCalls')}
          checked={includeInternal || hasIsInternal}
          disabled={hasIsInternal}
          onChange={() => {
            trackUa2FacetedSearchInternalCallsToggled({ dataSource, value: !includeInternal });
            setIncludeInternal(!includeInternal);
          }}
          disabledTooltipContent={t('in-applications:analyze.facetedSearch.defaultTurnedOnInternal')}
        />
      </Stack>
    </FacetedExpandableCard>
  );
}

function HiddenCallCheck({ label, checked, onChange, disabled, disabledTooltipContent }) {
  return (
    <Tooltip content={disabled && disabledTooltipContent} align="rightMiddle" delay={1000}>
      <Checkbox labelClassName={locals.label} label={label} checked={checked} onChange={onChange} disabled={disabled} />
    </Tooltip>
  );
}
