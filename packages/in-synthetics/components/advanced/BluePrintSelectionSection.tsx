/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { t } from '@instana/i18n-react';

import { AdvancedBluePrint, advancedBluePrintConfig } from 'in-synthetics/data/advancedModeBluePrints';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import SelectedTestType from 'in-synthetics/components/advanced/SelectedTestType';
import Menu from 'in-components/Menu';

import locals from './BluePrintSelectionSection.mless';

interface Props {
  selectedBlueprint: AdvancedBluePrint;
  setSelectedBlueprint: (item: AdvancedBluePrint) => void;
  form: MapForm;
  updateForm: (form: MapForm) => void;
  typeSelected: { ping: boolean; script: boolean };
  setTypeSelected: (type: { ping: boolean; script: boolean }) => void;
}

const BluePrintSelectionSection = ({
  selectedBlueprint,
  setSelectedBlueprint,
  form,
  updateForm,
  typeSelected,
  setTypeSelected
}: Props) => {
  return (
    <ExpandableLightCard
      label={t('in-synthetics:dialog.createTest.advancedMode.testTypes')}
      title={t('in-synthetics:dialog.createTest.advancedMode.selectedTestType')}
      bodyWithoutPadding
      openByDefault
      darkFrame
    >
      <div className={locals.container}>
        <SelectionMenu selectedBlueprint={selectedBlueprint} setSelectedBlueprint={setSelectedBlueprint} />
        <div className={locals.spanTwoColumns}>
          <SelectedTestType
            form={form}
            updateForm={updateForm}
            typeSelected={typeSelected}
            setTypeSelected={setTypeSelected}
          />
        </div>
      </div>
    </ExpandableLightCard>
  );
};

interface MenuProps {
  selectedBlueprint: AdvancedBluePrint;
  setSelectedBlueprint: (item: AdvancedBluePrint) => void;
}

const SelectionMenu = ({ selectedBlueprint, setSelectedBlueprint }: MenuProps) => {
  return (
    <div className={locals.container}>
      <Menu
        items={advancedBluePrintConfig}
        addRightSeparator
        onItemClick={item => {
          setSelectedBlueprint(item as AdvancedBluePrint);
        }}
        initialItemSelected={selectedBlueprint}
      />
    </div>
  );
};

export default BluePrintSelectionSection;
