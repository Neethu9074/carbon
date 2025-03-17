/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { BlueprintDescription, BlueprintText } from 'in-alerting/smart-alerts/components/dialog/BlueprintDescription';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import { idFromBluePrint } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import SideRadioMenu from 'in-components/SideRadioMenu';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/BlueprintSelection.mless';

export default function BlueprintSelection({
  blueprintConfigs,
  trackBlueprintChange,
  form,
  updateForm,
  createBlueprintForm
}) {
  const alertType = form.get('rule').get('alertType').value;
  // NOTE: Website alert configs does not have builtIn param
  const isBuiltIn = form.get('builtIn')?.value;
  const selectedBlueprintConfig = blueprintConfigs.find(item => item.type === alertType);

  return (
    <ExpandableLightCard
      label={selectedBlueprintConfig.name}
      title={t('in-alerting:smartAlerts.components.smartAlertDialog.selectedBlueprint')}
      bodyWithoutPadding
      openByDefault
      darkFrame
    >
      {isBuiltIn ? (
        <div className={locals.bluePrintText}>
          <BlueprintText config={selectedBlueprintConfig} />
        </div>
      ) : (
        <BlueprintSelectionMenu
          selectedBlueprintConfig={selectedBlueprintConfig}
          blueprintConfigs={blueprintConfigs}
          trackBlueprintChange={trackBlueprintChange}
          form={form}
          updateForm={updateForm}
          createBlueprintForm={createBlueprintForm}
        />
      )}
    </ExpandableLightCard>
  );
}

function BlueprintSelectionMenu({
  selectedBlueprintConfig,
  blueprintConfigs,
  trackBlueprintChange,
  form,
  updateForm,
  createBlueprintForm
}) {
  const [config, setConfig] = useState(selectedBlueprintConfig);
  const [selectButtonDisabled, setSelectButtonDisabled] = useState(true);

  return (
    <div className={locals.container}>
      <SideRadioMenu
        advancedMode
        items={blueprintConfigs.map(x => ({ id: idFromBluePrint(x), name: x.name }))}
        legendHidden
        legendText={t('in-alerting:smartAlerts.components.smartAlertDialog.selectedBlueprint')}
        onChange={id => {
          const item = blueprintConfigs.find(i => id === idFromBluePrint(i));
          setSelectButtonDisabled(false);
          setConfig(item);
          if (trackBlueprintChange) trackBlueprintChange(item.type);
        }}
        valueSelected={idFromBluePrint(config)}
      />
      <div className={locals.spanTwoColumns}>
        <BlueprintDescription
          config={config}
          selectButtonDisabled={selectButtonDisabled}
          onSelectBlueprint={blueprintConfig => {
            setSelectButtonDisabled(true);
            updateForm(createBlueprintForm(form, blueprintConfig.type, blueprintConfig.thresholdDefaults, false));
          }}
        />
      </div>
    </div>
  );
}

BlueprintSelection.propTypes = {
  blueprintConfigs: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      isBeta: PropTypes.bool,
      headline: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })
  ),
  form: PropTypes.object.isRequired,
  trackBlueprintChange: PropTypes.func,
  updateForm: PropTypes.func.isRequired,
  createBlueprintForm: PropTypes.func.isRequired
};
