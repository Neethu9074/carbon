/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Application, Result } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import { AdvancedBluePrint, advancedBluePrintConfig } from 'in-synthetics/data/advancedModeBluePrints';
import BluePrintSelectionSection from 'in-synthetics/components/advanced/BluePrintSelectionSection';
import ConfigurationSection from 'in-synthetics/components/advanced/ConfigurationSection';
import ConfigureLocations from 'in-synthetics/components/advanced/ConfigureLocations';
import SelectScheduleStep from 'in-synthetics/components/steps/SelectScheduleStep';
import IdentifySection from 'in-synthetics/components/advanced/IdentifySection';
import StepsContainer from 'in-components/StepsContainer/StepsContainer';
import { AdvancedModeProps } from 'in-synthetics/utils/constants';
import { pendingResult } from 'in-services/fixedObjects';
import { getApplicationsList } from 'in-synthetics/api';

const AdvancedMode = ({ form, updateForm, setSliderState }: AdvancedModeProps) => {
  const [selectedBlueprint, setSelectedBlueprint] = useState<AdvancedBluePrint>(advancedBluePrintConfig[0]);
  const [typeSelected, setTypeSelected] = useState({ ping: true, script: false });
  const applications: Result<Application[]> = useObservable<any, []>(() => getApplicationsList(), []) ?? pendingResult;
  return (
    <StepsContainer
      navItems={[
        {
          scrollId: '1',
          label: t('in-synthetics:dialog.createTest.advancedMode.selectedTestTypeSectionLabel'),
          title: '',
          valid: true,
          content: (
            <BluePrintSelectionSection
              selectedBlueprint={selectedBlueprint}
              setSelectedBlueprint={setSelectedBlueprint}
              typeSelected={typeSelected}
              setTypeSelected={setTypeSelected}
              form={form}
              updateForm={updateForm}
            />
          )
        },
        {
          scrollId: '2',
          label: t('in-synthetics:dialog.createTest.advancedMode.configurationLabel'),
          title: t('in-synthetics:dialog.createTest.advancedMode.configurationTitle'),
          valid: true,
          content: <ConfigurationSection form={form} updateForm={updateForm} />
        },
        {
          scrollId: '3',
          label: t('in-synthetics:dialog.createTest.advancedMode.locationsLabel'),
          title: t('in-synthetics:dialog.createTest.advancedMode.locationsTitle'),
          valid: true,
          content: <ConfigureLocations form={form} updateForm={updateForm} setSliderState={setSliderState} />
        },
        {
          scrollId: '4',
          label: t('in-synthetics:dialog.createTest.advancedMode.scheduleLabel'),
          title: t('in-synthetics:dialog.createTest.advancedMode.scheduleTitle'),
          valid: true,
          content: <SelectScheduleStep form={form} updateForm={updateForm} simpleMode={false} />
        },
        {
          scrollId: '5',
          label: t('in-synthetics:dialog.createTest.advancedMode.identifyLabel'),
          title: t('in-synthetics:dialog.createTest.advancedMode.identifyTitle'),
          valid: true,
          content: <IdentifySection form={form} updateForm={updateForm} applications={applications} />
        }
      ]}
    />
  );
};

export default AdvancedMode;
