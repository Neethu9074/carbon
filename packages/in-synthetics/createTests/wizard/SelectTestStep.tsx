/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { MapForm } from 'formalistic';
import React from 'react';

import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import { BluePrint, getSimpleBlueprintConfig } from 'in-synthetics/createTests/data/simpleModeBluePrints';
import SelectedBlueprintPresenter from 'in-components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import { syntheticWizardCreateTestTypeSwitch } from 'in-synthetics/tracking/tracker';
import { createForm } from 'in-synthetics/createTests/form/createSyntheticTestForm';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import Menu from 'in-alerting/smart-alerts/components/Menu';
import { Script } from 'in-synthetics/utils/constants';
import { Error as ScriptError } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/wizard/SelectTestStep.mless';

export interface Props {
  selectedBlueprint: BluePrint;
  onSelectBluePrint: (item: BluePrint) => void;
  updateForm: (form: MapForm<any>) => void;
  setScript: React.Dispatch<React.SetStateAction<Script>>;
  setScriptErrors: React.Dispatch<React.SetStateAction<ScriptError[]>>;
  simpleMode: boolean;
  setActiveTabIndex: React.Dispatch<React.SetStateAction<number>>;
}

interface Description {
  headline: string;
  htmlContent: string;
}

export default function SelectTestStep({
  selectedBlueprint,
  onSelectBluePrint,
  updateForm,
  setScript,
  setScriptErrors,
  simpleMode,
  setActiveTabIndex
}: Props) {
  const { trackCta } = useSegmentTracking();
  return (
    <SimpleModeStepContentWrapper headline={t('in-synthetics:dialog.createTest.selectTest.title')}>
      <Menu
        items={getSimpleBlueprintConfig()}
        addRightSeparator
        initialItemSelected={selectedBlueprint}
        onItemClick={item => {
          // Segment Tracker
          syntheticWizardCreateTestTypeSwitch(trackCta, item);
          onSelectBluePrint(item);
          updateForm(createForm(simpleMode, item));
          setScript({ name: '', text: '', extension: 'js' });
          setScriptErrors([] as ScriptError[]);
          setActiveTabIndex(0);
        }}
        direction="vertical"
      />
      <div className={locals.presenterWrapper}>
        <SelectedBlueprintPresenter title={selectedBlueprint.headline}>
          {selectedBlueprint.description?.map((paragraph: Description) => {
            return (
              <div key={paragraph.headline}>
                <div className={locals.descriptionHeadline}>{paragraph.headline}</div>
                <DangerousHtmlPresenter className={locals.htmlText} html={paragraph.htmlContent} />
              </div>
            );
          })}
        </SelectedBlueprintPresenter>
      </div>
    </SimpleModeStepContentWrapper>
  );
}
