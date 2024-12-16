/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';
import { MapForm } from 'formalistic';

import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import { getAllApplicationsForEntitySelectionWithDefaults } from 'in-applications/subscriptions/getAllApplicationsForEntitySelection';
import SimpleModePageNavigation from 'in-components/BlueprintFormMultistep/SimpleModePageNavigation';
import RequestResponseStep from 'in-synthetics/createTests/wizard/RequestResponseStep';
import SelectScheduleStep from 'in-synthetics/createTests/wizard/SelectScheduleStep';
import BasicDetailsStep from 'in-synthetics/createTests/wizard/BasicDetailsStep';
import AssociationsStep from 'in-synthetics/createTests/wizard/AssociationsStep';
import { BluePrint } from 'in-synthetics/createTests/data/simpleModeBluePrints';
import { GroupPermissionEntity, Error as ScriptError, Result } from 'in-types';
import SelectTestStep from 'in-synthetics/createTests/wizard/SelectTestStep';
import { Code, Script, SliderState } from 'in-synthetics/utils/constants';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import { noop, pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

import locals from 'in-synthetics/createTests/wizard/WizardModeContainer.mless';

interface WizardModeContainerProps {
  form: MapForm<any>;
  formId: string;
  onClose: () => void;
  onCreate: () => void;
  updateForm: (form: MapForm<any>) => void;
  simpleModeStep: number;
  setSimpleModeStep: React.Dispatch<React.SetStateAction<number>>;
  simpleMode: boolean;
  scriptErrors: ScriptError[];
  setScriptErrors: React.Dispatch<React.SetStateAction<ScriptError[]>>;
  scriptDetails: Code;
  setScriptDetails: React.Dispatch<React.SetStateAction<Code>>;
  isSaving: boolean;
  isStepDisabled: (step: number) => boolean | undefined;
  selectedBlueprint: BluePrint;
  setSelectedBlueprint: (item: BluePrint) => void;
  setSliderState: (state: SliderState) => void;
}

const WizardModeContainer = ({
  form,
  formId,
  onClose,
  onCreate,
  updateForm,
  setSimpleModeStep,
  simpleModeStep,
  simpleMode,
  scriptErrors,
  setScriptErrors,
  scriptDetails,
  setScriptDetails,
  isSaving,
  isStepDisabled,
  selectedBlueprint,
  setSelectedBlueprint,
  setSliderState
}: WizardModeContainerProps) => {
  const timeConfig = useTimeConfig();
  const applications: Result<GroupPermissionEntity[]> =
    useObservable<any, []>(() => getAllApplicationsForEntitySelectionWithDefaults({ timeConfig }), []) ?? pendingResult;

  const basicStepConfigs = [
    {
      title: t('in-synthetics:dialog.createTest.titles.step1')
    },
    {
      title: t('in-synthetics:dialog.createTest.titles.step2')
    },
    {
      title: t('in-synthetics:dialog.createTest.titles.step3')
    },
    {
      title: t('in-synthetics:dialog.createTest.titles.step4')
    },
    {
      title: t('in-synthetics:dialog.createTest.titles.step5')
    }
  ];
  const stepConfigs = syntheticRbacLimitedEnabled ? basicStepConfigs : basicStepConfigs.slice(0, 4);

  const [script, setScript] = useState<Script>({ name: '', text: '', extension: 'js' });
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <div className={locals.container}>
      <SimpleModePageNavigation
        form={form}
        formId={formId}
        onClose={onClose}
        onCreate={onCreate}
        updateForm={updateForm}
        setSimpleModeStep={setSimpleModeStep}
        renderStep={(step: number) => {
          switch (step) {
            case 0:
              return (
                <SelectTestStep
                  selectedBlueprint={selectedBlueprint}
                  onSelectBluePrint={setSelectedBlueprint}
                  updateForm={updateForm}
                  setScriptErrors={setScriptErrors}
                  simpleMode={simpleMode}
                  setScript={setScript}
                  setActiveTabIndex={setActiveTabIndex}
                />
              );
            case 1:
              return (
                <RequestResponseStep
                  selectedBlueprint={selectedBlueprint}
                  form={form}
                  updateForm={updateForm}
                  script={script}
                  setScript={setScript}
                  scriptErrors={scriptErrors}
                  setScriptErrors={setScriptErrors}
                  scriptDetails={scriptDetails}
                  setScriptDetails={setScriptDetails}
                  activeTabIndex={activeTabIndex}
                  setActiveTabIndex={setActiveTabIndex}
                />
              );
            case 2:
              return <SelectScheduleStep form={form} updateForm={updateForm} simpleMode={simpleMode} />;
            case 3:
              return (
                <BasicDetailsStep
                  selectedBlueprint={selectedBlueprint}
                  form={form}
                  updateForm={updateForm}
                  applications={applications}
                />
              );
            case 4:
              return (
                <AssociationsStep
                  form={form}
                  updateForm={updateForm}
                  applications={applications}
                  setSliderState={setSliderState}
                />
              );
            default:
              return null;
          }
        }}
        stepConfigs={stepConfigs}
        simpleModeStep={simpleModeStep}
        isSaving={isSaving}
        additionalStepCheck={(step: number) => {
          return step !== 0 ? isStepDisabled(step) ?? true : true;
        }}
        onStepChanged={noop}
      />
    </div>
  );
};

export default WizardModeContainer;
