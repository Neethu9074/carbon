/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { Checkbox, CheckboxGroup, Stack } from '@instana/carbon';
import type { CorrectionConfiguration } from '@instana/types';
import { TearsheetNarrow } from '@instana/ibm-products';
import { Typography } from '@instana/components';

import { close } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

import locals from './CorrectionWindowOverlayDialog.mless';

interface CorrectionWindowOverlayDialogProps {
  configurations: CorrectionConfiguration[];
  selectedConfigurations: CorrectionConfiguration[] | undefined;
  setSelectedConfigurations: (selectedConfigurations: CorrectionConfiguration[] | undefined) => void;
}

export default function CorrectionWindowOverlayDialog({
  configurations,
  selectedConfigurations,
  setSelectedConfigurations
}: CorrectionWindowOverlayDialogProps) {
  const [localSelectedConfigurations, setLocalSelectedConfigurations] = useState<CorrectionConfiguration[] | undefined>(
    selectedConfigurations
  );

  const handleSubmit = () => {
    setSelectedConfigurations(localSelectedConfigurations);
    close();
  };

  return (
    // @ts-expect-error
    <TearsheetNarrow
      open
      actions={[
        {
          key: 1,
          kind: 'primary',
          label: t('in-service-levels:general.done'),
          onClick: handleSubmit
        },
        {
          key: 2,
          kind: 'secondary',
          label: t('forms.actions.cancel'),
          onClick: close
        }
      ]}
      hasCloseIcon
      onClose={close}
      title={t('in-service-levels:sloDashboard.components.correctionWindowOverlayDialog.title')}
    >
      <Stack orientation="vertical" gap={2} className={locals['correction-windows-dialog-content']}>
        <Typography variant="body-regular">
          {t('in-service-levels:sloDashboard.components.correctionWindowOverlayDialog.description')}
        </Typography>
        <CorrectionWindowsCheckboxGroup
          configurations={configurations}
          localSelectedConfigurations={localSelectedConfigurations}
          setLocalSelectedConfigurations={setLocalSelectedConfigurations}
        />
      </Stack>
    </TearsheetNarrow>
  );
}

interface CorrectionWindowsCheckboxGroupProps {
  configurations: CorrectionConfiguration[];
  localSelectedConfigurations: CorrectionConfiguration[] | undefined;
  setLocalSelectedConfigurations: (selectedConfigurations: CorrectionConfiguration[] | undefined) => void;
}

function CorrectionWindowsCheckboxGroup({
  configurations,
  localSelectedConfigurations,
  setLocalSelectedConfigurations
}: CorrectionWindowsCheckboxGroupProps) {
  // Empty array represents "all selected", undefined represents "none selected"
  const allSelected = localSelectedConfigurations && localSelectedConfigurations.length === 0;
  const allIndeterminate =
    localSelectedConfigurations &&
    localSelectedConfigurations.length > 0 &&
    localSelectedConfigurations.length < configurations.length;

  const handleSelectAll = () => {
    setLocalSelectedConfigurations(allSelected ? undefined : []);
  };

  return (
    <CheckboxGroup legendText="">
      <Checkbox
        checked={allSelected}
        indeterminate={allIndeterminate}
        id="all-correction-windows"
        onClick={handleSelectAll}
        labelText={t('in-service-levels:sloDashboard.components.correctionWindowOverlayDialog.all')}
      />
      <div className={locals['correction-windows-checkboxes']}>
        {configurations?.map(configuration => (
          <CorrectionWindowsCheckbox
            key={configuration.id!}
            configuration={configuration}
            configurations={configurations}
            localSelectedConfigurations={localSelectedConfigurations}
            setLocalSelectedConfigurations={setLocalSelectedConfigurations}
          />
        ))}
      </div>
    </CheckboxGroup>
  );
}

function CorrectionWindowsCheckbox({
  configuration,
  configurations,
  localSelectedConfigurations,
  setLocalSelectedConfigurations
}: CorrectionWindowsCheckboxGroupProps & { configuration: CorrectionConfiguration }) {
  const handleSelect = (configuration: CorrectionConfiguration) => {
    // Special case: When all items are selected (empty array) and we click one
    if (localSelectedConfigurations && localSelectedConfigurations.length === 0) {
      // Create an array with all items EXCEPT the one clicked
      const allExceptClicked = configurations.filter(c => c.id !== configuration.id);
      setLocalSelectedConfigurations(allExceptClicked);
    }
    // Normal case: Item is in the selection array - remove it
    else if (localSelectedConfigurations && localSelectedConfigurations.some(c => c.id === configuration.id)) {
      const newSelection = localSelectedConfigurations.filter(c => c.id !== configuration.id);
      setLocalSelectedConfigurations(newSelection);
    }
    // Normal case: Item is not in the selection array - add it
    else {
      const newSelection = [...(localSelectedConfigurations ?? []), configuration];

      // If all items are now selected individually, convert to empty array (all selected)
      if (newSelection.length === configurations.length) {
        setLocalSelectedConfigurations([]);
      } else {
        setLocalSelectedConfigurations(newSelection);
      }
    }
  };

  const getIsChecked = (configuration: CorrectionConfiguration) => {
    if (!localSelectedConfigurations) return false;
    // Item is checked if:
    // 1. Empty array (all selected)
    // 2. Item is in the selection array
    return localSelectedConfigurations.length === 0 || localSelectedConfigurations.some(c => c.id === configuration.id);
  };

  return (
    <Checkbox
      key={configuration.id!}
      checked={getIsChecked(configuration)}
      id={`correction-window-${configuration.id}`}
      labelText={configuration.name!}
      onClick={() => handleSelect(configuration)}
    />
  );
}
