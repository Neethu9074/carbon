/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { t } from '@instana/i18n-react';

import { AdvancedBluePrint, getAdvancedBlueprintConfig } from 'in-synthetics/createTests/data/advancedModeBluePrints';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import SelectedTestType from 'in-synthetics/createTests/advanced/SelectedTestType';
import { syntheticBrowserCreateTestEnabled } from 'in-services/featureFlags';
import { Code, TestTypeSelected } from 'in-synthetics/utils/constants';
import Menu from 'in-components/Menu';

import locals from 'in-synthetics/createTests/advanced/BluePrintSelectionSection.mless';

interface BluePrintSelectionSectionProps {
  selectedBlueprint: AdvancedBluePrint;
  setSelectedBlueprint: (item: AdvancedBluePrint) => void;
  updateForm: (form: MapForm<any>) => void;
  testTypeSelected: TestTypeSelected;
  setTestTypeSelected: (t: TestTypeSelected) => void;
  setRenderSectionsCounter: React.Dispatch<React.SetStateAction<number>>;
  commonAttributes: Record<string, any>;
  setCommonAttributes: (type: Record<string, any>) => void;
  isUpdateConfig: boolean;
  setScriptDetails: React.Dispatch<React.SetStateAction<Code>>;
}

const BluePrintSelectionSection = ({
  selectedBlueprint,
  setSelectedBlueprint,
  updateForm,
  testTypeSelected,
  setTestTypeSelected,
  setRenderSectionsCounter,
  commonAttributes,
  setCommonAttributes,
  isUpdateConfig,
  setScriptDetails
}: BluePrintSelectionSectionProps) => {
  return (
    <ExpandableLightCard
      title={t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.selectedTestTypeLightCardTitle')}
      label={selectedBlueprint.label}
      bodyWithoutPadding
      openByDefault
      darkFrame
    >
      <SelectionMenu
        selectedBlueprint={selectedBlueprint}
        setSelectedBlueprint={setSelectedBlueprint}
        updateForm={updateForm}
        testTypeSelected={testTypeSelected}
        setTestTypeSelected={setTestTypeSelected}
        setRenderSectionsCounter={setRenderSectionsCounter}
        commonAttributes={commonAttributes}
        setCommonAttributes={setCommonAttributes}
        isUpdateConfig={isUpdateConfig}
        setScriptDetails={setScriptDetails}
      />
    </ExpandableLightCard>
  );
};

interface SelectionMenuProps {
  selectedBlueprint: AdvancedBluePrint;
  setSelectedBlueprint: (item: AdvancedBluePrint) => void;
  updateForm: (form: MapForm<any>) => void;
  testTypeSelected: TestTypeSelected;
  setTestTypeSelected: (t: TestTypeSelected) => void;
  setRenderSectionsCounter: React.Dispatch<React.SetStateAction<number>>;
  commonAttributes: Record<string, any>;
  setCommonAttributes: (type: Record<string, any>) => void;
  isUpdateConfig: boolean;
  setScriptDetails: React.Dispatch<React.SetStateAction<Code>>;
}

const SelectionMenu = ({
  selectedBlueprint,
  setSelectedBlueprint,
  updateForm,
  testTypeSelected,
  setTestTypeSelected,
  setRenderSectionsCounter,
  commonAttributes,
  setCommonAttributes,
  isUpdateConfig,
  setScriptDetails
}: SelectionMenuProps) => {
  return (
    <div className={locals.container}>
      <Menu
        items={getAdvancedBlueprintConfig(syntheticBrowserCreateTestEnabled)}
        addRightSeparator
        onItemClick={item => {
          setSelectedBlueprint(item as AdvancedBluePrint);
          //@ts-expect-error
          setTestTypeSelected((prevState: SetStateAction<TestTypeSelected>) => {
            return { ...prevState, api: { simple: false, script: false }, browser: { simple: false, script: false } };
          });
          setRenderSectionsCounter(0);
        }}
        initialItemSelected={selectedBlueprint}
      />
      <div className={locals.spanTwoColumns}>
        <SelectedTestType
          selectedBlueprint={selectedBlueprint}
          updateForm={updateForm}
          testTypeSelected={testTypeSelected}
          setTestTypeSelected={setTestTypeSelected}
          setRenderSectionsCounter={setRenderSectionsCounter}
          commonAttributes={commonAttributes}
          setCommonAttributes={setCommonAttributes}
          isUpdateConfig={isUpdateConfig}
          setScriptDetails={setScriptDetails}
        />
      </div>
    </div>
  );
};

export default BluePrintSelectionSection;
