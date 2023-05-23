/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { Application, Result } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import { AdvancedBluePrint, getAdvancedBlueprintConfig } from 'in-synthetics/data/advancedModeBluePrints';
import BluePrintSelectionSection from 'in-synthetics/components/advanced/BluePrintSelectionSection';
import CustomPropertiesSection from 'in-synthetics/components/advanced/CustomPropertiesSection';
import ConfigurationSection from 'in-synthetics/components/advanced/ConfigurationSection';
import ConfigureLocations from 'in-synthetics/components/advanced/ConfigureLocations';
import SelectScheduleStep from 'in-synthetics/components/steps/SelectScheduleStep';
import IdentifySection from 'in-synthetics/components/advanced/IdentifySection';
import ScriptsSection from 'in-synthetics/components/advanced/ScriptsSection';
import { syntheticBrowserCreateTestEnabled } from 'in-services/featureFlags';
import StepsContainer from 'in-components/StepsContainer/StepsContainer';
import { AdvancedModeProps } from 'in-synthetics/utils/constants';
import { pendingResult } from 'in-services/fixedObjects';
import { getApplicationsList } from 'in-synthetics/api';

const AdvancedMode = ({
  form,
  updateForm,
  setSliderState,
  testTypeSelected,
  setTestTypeSelected,
  renderSectionsCounter,
  setRenderSectionsCounter,
  commonAttributes,
  setCommonAttributes,
  setCustomSlideInHeaderConfig,
  isUpdateConfig
}: AdvancedModeProps) => {
  const [selectedBlueprint, setSelectedBlueprint] = useState<AdvancedBluePrint>(
    getAdvancedBlueprintConfig(syntheticBrowserCreateTestEnabled)[0]
  );
  const applications: Result<Application[]> = useObservable<any, []>(() => getApplicationsList(), []) ?? pendingResult;
  const configForm = form.get('configuration') as MapForm<any>;
  const syntheticTypeField = configForm.get('syntheticType') as Field<string>;

  const getTestTypeSection = (syntheticType: string) => {
    if (syntheticType === 'HTTPScript') {
      return (
        <ScriptsSection
          form={form}
          updateForm={updateForm}
          setSliderState={setSliderState}
          setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
          isUpdateConfig={isUpdateConfig}
        />
      );
    }
    return <ConfigurationSection form={form} updateForm={updateForm} isUpdateConfig={isUpdateConfig} />;
  };

  const mainSection = {
    scrollId: '1',
    label: t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.rightListLabel'),
    title: '',
    valid: true,
    content: (
      <BluePrintSelectionSection
        selectedBlueprint={selectedBlueprint}
        setSelectedBlueprint={setSelectedBlueprint}
        testTypeSelected={testTypeSelected}
        setTestTypeSelected={setTestTypeSelected}
        updateForm={updateForm}
        setRenderSectionsCounter={setRenderSectionsCounter}
        commonAttributes={commonAttributes}
        setCommonAttributes={setCommonAttributes}
        isUpdateConfig={isUpdateConfig}
      />
    )
  };

  const switchTestTypeSection = {
    scrollId: '2',
    label: t('in-synthetics:dialog.createTest.advancedMode.configurationLabel'),
    title: t('in-synthetics:dialog.createTest.advancedMode.configurationTitle'),
    valid: true,
    content: getTestTypeSection(syntheticTypeField.value)
  };

  const commonSections = [
    {
      scrollId: '3',
      label: t('in-synthetics:dialog.createTest.advancedMode.locationsLabel'),
      title: t('in-synthetics:dialog.createTest.advancedMode.locationsTitle'),
      valid: true,
      content: (
        <ConfigureLocations
          form={form}
          updateForm={updateForm}
          setSliderState={setSliderState}
          syntheticType={syntheticTypeField.value}
        />
      )
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
    },
    {
      scrollId: '6',
      label: t('in-synthetics:dialog.createTest.advancedMode.customPropertiesTitle'),
      title: t('in-synthetics:dialog.createTest.advancedMode.customPropertiesTitle'),
      valid: true,
      content: <CustomPropertiesSection form={form} updateForm={updateForm} />
    }
  ];

  const getRenderSections = (value: number) => {
    if (value >= 1) {
      return [mainSection, switchTestTypeSection, ...commonSections];
    }
    return [mainSection];
  };

  return <StepsContainer navItems={getRenderSections(renderSectionsCounter)} />;
};

export default AdvancedMode;
