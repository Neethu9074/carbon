/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';

import { CreateTearsheetStep } from '@instana/ibm-products';
import { Error } from '@instana/types';

import CorrectionWindowFormContext from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/CorrectionWindowFormContext';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import useSloListFilters from 'in-service-levels/components/Shared/SloListSelection/hooks/useSloListFilters';
import SloListSelection from 'in-service-levels/components/Shared/SloListSelection/SloListSelectionV2';
import { FetchStatus } from 'in-hooks/utils/types';
import { t } from 'in-i18n';

interface ScopeSectionProps {
  submitStatus?: FetchStatus;
  errors: Error[] | undefined;
}

export default function ScopeSection({ submitStatus, errors }: ScopeSectionProps) {
  const { form, onChange } = useContext(CorrectionWindowFormContext);
  const sloIdsField = form.get('sloIds');
  const {
    columnFilters,
    localFilters,
    setFilters,
    resetFilters,
    toggleFilter,
    setColumnFiltersFromLocalFilters,
    resetLocalFiltersToColumnFilters
  } = useSloListFilters();

  return (
    <CreateTearsheetStep
      hasFieldset={false}
      title={t('in-service-levels:configureCorrectionWindowDialog.components.scopeSection.title')}
      secondaryLabel={t('in-service-levels:configureCorrectionWindowDialog.components.scopeSection.secondaryLabel')}
      disableSubmit={submitStatus === 'pending'}
      subtitle={t('in-service-levels:configureCorrectionWindowDialog.components.scopeSection.subtitle')}
      onPrevious={resetFilters}
    >
      <ErroneousResultPresenter errors={errors} />
      <SloListSelection
        columnFilters={columnFilters}
        localFilters={localFilters}
        setFilters={setFilters}
        resetFilters={resetFilters}
        toggleFilter={toggleFilter}
        setColumnFiltersFromLocalFilters={setColumnFiltersFromLocalFilters}
        resetLocalFiltersToColumnFilters={resetLocalFiltersToColumnFilters}
        sloIdsField={sloIdsField}
        onSelect={item => onChange(['sloIds'], () => item)}
      />
    </CreateTearsheetStep>
  );
}
