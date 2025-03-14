/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import { kebabCase } from 'lodash';

import { CarbonStack as Stack, CarbonCheckbox as Checkbox, Tooltip, Typography } from '@instana/components';
import { DataSource, TagFilter } from '@instana/types';

// @ts-expect-error needs TS migration
import FacetedExpandableCard from 'in-components/AnalyzeView/FacetedFilters/FacetedExpandableCard';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { useAnalyzeTracker } from 'in-analyze/hooks/useAnalyzeTracker';
import { t } from 'in-i18n';

interface FacetedFilterHiddenCallsProps {
  title: string;
  formModel: TagFilter[];
  formModelWithFacets: TagFilter[];
  includeSynthetic: boolean;
  includeInternal: boolean;
  setIncludeSynthetic: (includeSynthetic: boolean) => void;
  setIncludeInternal: (includeInternal: boolean) => void;
  dataSource: Lowercase<DataSource>;
  openByDefault: boolean;
}

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
}: FacetedFilterHiddenCallsProps) {
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
      <Stack gap={2}>
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

interface HiddenCallCheckProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  disabled: boolean;
  disabledTooltipContent: string;
}

function HiddenCallCheck({ label, checked, onChange, disabled, disabledTooltipContent }: HiddenCallCheckProps) {
  return (
    <Tooltip content={disabled && disabledTooltipContent} align="rightMiddle" delay={1000}>
      <Checkbox
        id={kebabCase(label)}
        labelText={<Typography variant="label-01">{label}</Typography>}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
    </Tooltip>
  );
}
