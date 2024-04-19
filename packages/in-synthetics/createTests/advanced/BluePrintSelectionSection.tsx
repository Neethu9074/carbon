/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { t } from '@instana/i18n-react';

import { AdvancedBluePrint, getAdvancedBlueprintConfig } from 'in-synthetics/createTests/data/advancedModeBluePrints';
import SelectedTestType from 'in-synthetics/createTests/advanced/SelectedTestType';
import { Code, ConfigItem, TestTypeSelected } from 'in-synthetics/utils/constants';
import { syntheticAdvancedCreateTestTypeSwitch } from 'in-synthetics/tracker';
import { syntheticCertificateCheckEnabled } from 'in-services/featureFlags';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import Menu from 'in-components/Menu';

import locals from 'in-synthetics/createTests/advanced/BluePrintSelectionSection.mless';

interface BluePrintSelectionSectionProps {
  selectedBlueprint: AdvancedBluePrint;
  setSelectedBlueprint: (item: AdvancedBluePrint) => void;
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  testTypeSelected: TestTypeSelected;
  setTestTypeSelected: (t: TestTypeSelected) => void;
  setRenderSectionsCounter: React.Dispatch<React.SetStateAction<number>>;
  commonAttributes: Record<string, any>;
  setCommonAttributes: (type: Record<string, any>) => void;
  isUpdateConfig: boolean;
  setScriptDetails: React.Dispatch<React.SetStateAction<Code>>;
  setHeaders: React.Dispatch<React.SetStateAction<ConfigItem[]>>;
}

const BluePrintSelectionSection = ({
  selectedBlueprint,
  setSelectedBlueprint,
  form,
  updateForm,
  testTypeSelected,
  setTestTypeSelected,
  setRenderSectionsCounter,
  commonAttributes,
  setCommonAttributes,
  isUpdateConfig,
  setScriptDetails,
  setHeaders
}: BluePrintSelectionSectionProps) => {
  return (
    <LightCard
      title={t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.selectedTestTypeLightCardTitle')}
      label={selectedBlueprint.label}
      withoutPadding
      useMaxAvailableHeight
      darkFrame
    >
      <SelectionMenu
        selectedBlueprint={selectedBlueprint}
        setSelectedBlueprint={setSelectedBlueprint}
        form={form}
        updateForm={updateForm}
        testTypeSelected={testTypeSelected}
        setTestTypeSelected={setTestTypeSelected}
        setRenderSectionsCounter={setRenderSectionsCounter}
        commonAttributes={commonAttributes}
        setCommonAttributes={setCommonAttributes}
        isUpdateConfig={isUpdateConfig}
        setScriptDetails={setScriptDetails}
        setHeaders={setHeaders}
      />
    </LightCard>
  );
};

interface SelectionMenuProps {
  selectedBlueprint: AdvancedBluePrint;
  setSelectedBlueprint: (item: AdvancedBluePrint) => void;
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  testTypeSelected: TestTypeSelected;
  setTestTypeSelected: (t: TestTypeSelected) => void;
  setRenderSectionsCounter: React.Dispatch<React.SetStateAction<number>>;
  commonAttributes: Record<string, any>;
  setCommonAttributes: (type: Record<string, any>) => void;
  isUpdateConfig: boolean;
  setScriptDetails: React.Dispatch<React.SetStateAction<Code>>;
  setHeaders: React.Dispatch<React.SetStateAction<ConfigItem[]>>;
}

const SelectionMenu = ({
  selectedBlueprint,
  setSelectedBlueprint,
  form,
  updateForm,
  testTypeSelected,
  setTestTypeSelected,
  setRenderSectionsCounter,
  commonAttributes,
  setCommonAttributes,
  isUpdateConfig,
  setScriptDetails,
  setHeaders
}: SelectionMenuProps) => {
  return (
    <div className={classNames(locals.container, { [locals.disabled]: isUpdateConfig })}>
      <Menu
        items={getAdvancedBlueprintConfig(syntheticCertificateCheckEnabled)}
        addRightSeparator
        onItemClick={item => {
          // Tracker
          syntheticAdvancedCreateTestTypeSwitch({
            detail: `Switched to create ${item.type} test section from advanced mode`
          });
          setCommonAttributes({ ...commonAttributes, syntheticType: '' });
          setSelectedBlueprint(item as AdvancedBluePrint);
          //@ts-expect-error
          setTestTypeSelected((prevState: SetStateAction<TestTypeSelected>) => {
            return { ...prevState, api: { simple: false, script: false }, browser: { simple: false, script: false } };
          });
          setRenderSectionsCounter(0);
          setHeaders([
            {
              id: generateUniqueShortId(),
              key: '',
              value: '',
              error: {
                name: { invalid: false, message: '' },
                value: { invalid: false, message: '' }
              }
            }
          ]);
        }}
        initialItemSelected={selectedBlueprint}
      />
      <div className={locals.spanTwoColumns}>
        <SelectedTestType
          selectedBlueprint={selectedBlueprint}
          form={form}
          updateForm={updateForm}
          testTypeSelected={testTypeSelected}
          setTestTypeSelected={setTestTypeSelected}
          setRenderSectionsCounter={setRenderSectionsCounter}
          commonAttributes={commonAttributes}
          setCommonAttributes={setCommonAttributes}
          isUpdateConfig={isUpdateConfig}
          setScriptDetails={setScriptDetails}
          setHeaders={setHeaders}
        />
      </div>
    </div>
  );
};

export default BluePrintSelectionSection;
