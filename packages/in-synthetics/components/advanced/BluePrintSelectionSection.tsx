/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { t } from '@instana/i18n-react';

import { AdvancedBluePrint, getAdvancedBlueprintConfig } from 'in-synthetics/data/advancedModeBluePrints';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import SelectedTestType from 'in-synthetics/components/advanced/SelectedTestType';
import { syntheticBrowserCreateTestEnabled } from 'in-services/featureFlags';
import Menu from 'in-components/Menu';

import locals from './BluePrintSelectionSection.mless';

interface BluePrintSelectionSectionProps {
  selectedBlueprint: AdvancedBluePrint;
  setSelectedBlueprint: (item: AdvancedBluePrint) => void;
  updateForm: (form: MapForm<any>) => void;
  testTypeSelected: { simple: boolean; script: boolean };
  setTestTypeSelected: (type: { simple: boolean; script: boolean }) => void;
  setRenderSectionsCounter: React.Dispatch<React.SetStateAction<number>>;
  commonAttributes: Record<string, any>;
  setCommonAttributes: (type: Record<string, any>) => void;
  isUpdateConfig: boolean;
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
  isUpdateConfig
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
      />
    </ExpandableLightCard>
  );
};

interface SelectionMenuProps {
  selectedBlueprint: AdvancedBluePrint;
  setSelectedBlueprint: (item: AdvancedBluePrint) => void;
  updateForm: (form: MapForm<any>) => void;
  testTypeSelected: { simple: boolean; script: boolean };
  setTestTypeSelected: (type: { simple: boolean; script: boolean }) => void;
  setRenderSectionsCounter: React.Dispatch<React.SetStateAction<number>>;
  commonAttributes: Record<string, any>;
  setCommonAttributes: (type: Record<string, any>) => void;
  isUpdateConfig: boolean;
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
  isUpdateConfig
}: SelectionMenuProps) => {
  return (
    <div className={locals.container}>
      <Menu
        items={getAdvancedBlueprintConfig(syntheticBrowserCreateTestEnabled)}
        addRightSeparator
        onItemClick={item => {
          setSelectedBlueprint(item as AdvancedBluePrint);
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
        />
      </div>
    </div>
  );
};

export default BluePrintSelectionSection;
