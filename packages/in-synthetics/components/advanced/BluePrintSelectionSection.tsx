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
}

const BluePrintSelectionSection = ({
  selectedBlueprint,
  setSelectedBlueprint,
  updateForm,
  testTypeSelected,
  setTestTypeSelected,
  setRenderSectionsCounter
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
}

const SelectionMenu = ({
  selectedBlueprint,
  setSelectedBlueprint,
  updateForm,
  testTypeSelected,
  setTestTypeSelected,
  setRenderSectionsCounter
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
        />
      </div>
    </div>
  );
};

export default BluePrintSelectionSection;
