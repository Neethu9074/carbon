/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { GroupPermissionEntity, Result, SyntheticLocation } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import { getAllApplicationsForEntitySelectionWithDefaults } from 'in-applications/subscriptions/getAllApplicationsForEntitySelection';
import { AdvancedBluePrint, getAdvancedBlueprintConfig } from 'in-synthetics/createTests/data/advancedModeBluePrints';
import SSLCertificateConfiguration from 'in-synthetics/createTests/advanced/SSLCertificateConfiguration';
import BrowserSimpleConfiguration from 'in-synthetics/createTests/advanced/BrowserSimpleConfiguration';
import BluePrintSelectionSection from 'in-synthetics/createTests/advanced/BluePrintSelectionSection';
import AssociationsCommonSection from 'in-synthetics/createTests/wizard/AssociationsCommonSection';
import CustomPropertiesSection from 'in-synthetics/createTests/advanced/CustomPropertiesSection';
import ConfigurationSection from 'in-synthetics/createTests/advanced/ConfigurationSection';
import ApplicationsSection from 'in-synthetics/createTests//wizard/ApplicationsSection';
import ConfigureLocations from 'in-synthetics/createTests/advanced/ConfigureLocations';
import SelectScheduleStep from 'in-synthetics/createTests/wizard/SelectScheduleStep';
import DNSConfiguration from 'in-synthetics/createTests/advanced/DNSConfiguration';
import IdentifySection from 'in-synthetics/createTests/advanced/IdentifySection';
import ScriptsSection from 'in-synthetics/createTests/advanced/ScriptsSection';
import StepsContainer from 'in-components/StepsContainer/StepsContainer';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import { getLocationsAsResultObservable } from 'in-synthetics/api';
import { AdvancedModeProps } from 'in-synthetics/utils/constants';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

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
  isUpdateConfig,
  scriptDetails,
  setScriptDetails,
  headers,
  setHeaders,
  invalidHeader,
  setInvalidHeader,
  invalidJSON,
  setInvalidJSON,
  customProperties,
  setCustomProperties,
  invalidCustomProperty,
  setInvalidCustomProperty,
  invalidTimeout,
  setInvalidTimeout,
  targetFilters,
  setTargetFilters
}: AdvancedModeProps) => {
  const EMPTY = [] as SyntheticLocation[];
  const getSelectedBlueprintIndex = () => {
    if (testTypeSelected.browser.simple || testTypeSelected.browser.script) {
      return 1;
    } else if (testTypeSelected.api.simple || testTypeSelected.api.script) {
      return 0;
    } else if (testTypeSelected.ssl.simple) {
      return 2;
    } else {
      return 3;
    }
  };
  const [selectedBlueprint, setSelectedBlueprint] = useState<AdvancedBluePrint>(
    getAdvancedBlueprintConfig()[getSelectedBlueprintIndex()]
  );
  const timeConfig = useTimeConfig();
  const applications: Result<GroupPermissionEntity[]> =
    useObservable<any, []>(() => getAllApplicationsForEntitySelectionWithDefaults({ timeConfig }), []) ?? pendingResult;
  const configForm = form.get('configuration') as MapForm<any>;
  const syntheticTypeField = configForm.get('syntheticType') as Field<string>;

  const locations = (locationType: string) =>
    getLocationsAsResultObservable(syntheticTypeField.value, locationType)
      .map((result: Result<SyntheticLocation[]> | null) => {
        return (result as Result<SyntheticLocation[]>)?.data;
      })
      .map(result => result ?? EMPTY);

  const getTestTypeSection = (syntheticType: string) => {
    switch (syntheticType) {
      case 'HTTPScript':
      case 'BrowserScript':
      case 'WebpageScript':
        return (
          <ScriptsSection
            form={form}
            updateForm={updateForm}
            setSliderState={setSliderState}
            setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
            isUpdateConfig={isUpdateConfig}
            scriptDetails={scriptDetails!}
            setScriptDetails={setScriptDetails!}
            commonAttributes={commonAttributes}
            setCommonAttributes={setCommonAttributes}
            isBrowser={syntheticType !== 'HTTPScript'}
            invalidTimeout={invalidTimeout}
            setInvalidTimeout={setInvalidTimeout}
          />
        );
      case 'HTTPAction':
        return (
          <ConfigurationSection
            form={form}
            updateForm={updateForm}
            isUpdateConfig={isUpdateConfig}
            headers={headers}
            setHeaders={setHeaders}
            invalidHeader={invalidHeader}
            setInvalidHeader={setInvalidHeader}
            invalidJSON={invalidJSON}
            setInvalidJSON={setInvalidJSON}
            invalidTimeout={invalidTimeout}
            setInvalidTimeout={setInvalidTimeout}
          />
        );
      case 'WebpageAction':
        return (
          <BrowserSimpleConfiguration
            form={form}
            updateForm={updateForm}
            invalidTimeout={invalidTimeout}
            setInvalidTimeout={setInvalidTimeout}
          />
        );
      case 'SSLCertificate':
        return (
          <SSLCertificateConfiguration
            form={form}
            updateForm={updateForm}
            invalidTimeout={invalidTimeout}
            setInvalidTimeout={setInvalidTimeout}
          />
        );
      case 'DNS':
        return (
          <DNSConfiguration
            form={form}
            updateForm={updateForm}
            targetFilters={targetFilters}
            setTargetFilters={setTargetFilters}
            invalidTimeout={invalidTimeout}
            setInvalidTimeout={setInvalidTimeout}
          />
        );
      default:
        return null;
    }
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
        form={form}
        updateForm={updateForm}
        setRenderSectionsCounter={setRenderSectionsCounter}
        commonAttributes={commonAttributes}
        setCommonAttributes={setCommonAttributes}
        isUpdateConfig={isUpdateConfig}
        setScriptDetails={setScriptDetails!}
        setHeaders={setHeaders}
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
          locations={locations}
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
    syntheticRbacLimitedEnabled
      ? {
          scrollId: '6',
          label: t('in-synthetics:dialog.createTest.advancedMode.associationsLabel'),
          title: t('in-synthetics:dialog.createTest.advancedMode.associationsTitle'),
          subTitle: t('in-synthetics:dialog.createTest.advancedMode.associationsDescription'),
          valid: true,
          content: <AssociationsCommonSection form={form} updateForm={updateForm} setSliderState={setSliderState} />
        }
      : {
          scrollId: '6',
          label: t('in-synthetics:dialog.createTest.advancedMode.associationsLabel'),
          title: t('in-synthetics:dialog.createTest.advancedMode.applicationsTitle'),
          subTitle: t('in-synthetics:dialog.createTest.advancedMode.applicationsDescription'),
          valid: true,
          content: <ApplicationsSection form={form} updateForm={updateForm} applications={applications} />
        },
    {
      scrollId: '7',
      label: t('in-synthetics:dialog.createTest.advancedMode.customPropertiesTitle'),
      title: t('in-synthetics:dialog.createTest.advancedMode.customPropertiesTitle'),
      valid: true,
      content: (
        <CustomPropertiesSection
          form={form}
          updateForm={updateForm}
          customProperties={customProperties}
          setCustomProperties={setCustomProperties}
          invalidCustomProperty={invalidCustomProperty}
          setInvalidCustomProperty={setInvalidCustomProperty}
        />
      )
    }
  ];

  const getRenderSections = (value: number) => {
    if (value >= 1) {
      return syntheticRbacLimitedEnabled
        ? [mainSection, switchTestTypeSection, ...commonSections]
        : [
            mainSection,
            switchTestTypeSection,
            ...commonSections.filter(commonSection => commonSection.scrollId !== '6')
          ];
    }
    return [mainSection];
  };

  return <StepsContainer navItems={getRenderSections(renderSectionsCounter)} />;
};

export default AdvancedMode;
