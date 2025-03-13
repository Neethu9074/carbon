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
import { syntheticAdvancedCreateTestTypeSwitch } from 'in-synthetics/tracking/tracker';
import SelectedTestType from 'in-synthetics/createTests/advanced/SelectedTestType';
import { Code, ConfigItem, TestTypeSelected } from 'in-synthetics/utils/constants';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import SideRadioMenu from 'in-components/SideRadioMenu';

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
  const { trackCta } = useSegmentTracking();
  const blueprintConfigs = getAdvancedBlueprintConfig();
  return (
    <div
      className={classNames(locals.container, {
        [locals.disabled]: isUpdateConfig
      })}
    >
      <SideRadioMenu
        items={blueprintConfigs.map(x => ({ id: x.type, name: x.name }))}
        legendHidden
        legendText={t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.selectedTestTypeLightCardTitle')}
        onChange={type => {
          const item = blueprintConfigs.find(x => x.type === type);
          if (!item) {
            return;
          }
          const isSSLCertificate = item.type === 'Certificate Check';
          const isDNS = item.type === 'DNS';
          const getSyntheticType = () => {
            if (isSSLCertificate) return 'SSLCertificate';
            else if (isDNS) return 'DNS';
            return '';
          };

          setCommonAttributes({ ...commonAttributes, syntheticType: getSyntheticType() });
          // Segment Tracker
          syntheticAdvancedCreateTestTypeSwitch(trackCta, item);
          setSelectedBlueprint(item as AdvancedBluePrint);
          //@ts-expect-error
          setTestTypeSelected((prevState: SetStateAction<TestTypeSelected>) => {
            return {
              ...prevState,
              api: { simple: false, script: false },
              browser: { simple: false, script: false },
              ssl: { simple: isSSLCertificate },
              dns: { simple: isDNS }
            };
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
        valueSelected={selectedBlueprint.type}
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
