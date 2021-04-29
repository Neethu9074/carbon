/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { BlueprintDescription } from 'in-alerting/smart-alerts/components/smart-alert-dialog/BlueprintDescription';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import Menu from 'in-alerting/components/Menu';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/BlueprintSelection.mless';

export default function BlueprintSelection({
  blueprintConfigs,
  trackBlueprintChange,
  form,
  updateForm,
  createBlueprintForm
}) {
  const alertType = form.get('rule').get('alertType').value;
  const selectedBlueprintConfig = blueprintConfigs.find(item => item.type === alertType);

  const [config, setConfig] = useState(selectedBlueprintConfig);
  const [selectButtonDisabled, setSelectButtonDisabled] = useState(true);

  return (
    <ExpandableLightCard
      label={selectedBlueprintConfig.name}
      title={t('in-alerting:smartAlerts.components.smartAlertDialog.selectedBlueprint')}
      bodyWithoutPadding
      openByDefault
      darkFrame
    >
      <div className={locals.container}>
        <Menu
          items={blueprintConfigs}
          onItemClick={item => {
            setSelectButtonDisabled(false);
            setConfig(item);
            trackBlueprintChange(item.type);
          }}
          initialItemSelected={selectedBlueprintConfig}
        />
        <div className={locals.spanTwoColumns}>
          <BlueprintDescription
            config={config}
            selectButtonDisabled={selectButtonDisabled}
            onSelectBlueprint={blueprintConfig => {
              setSelectButtonDisabled(true);
              updateForm(createBlueprintForm(form, blueprintConfig.type, blueprintConfig.thresholdDefaults));
            }}
          />
        </div>
      </div>
    </ExpandableLightCard>
  );
}

BlueprintSelection.propTypes = {
  blueprintConfigs: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      headline: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })
  ),
  form: PropTypes.object.isRequired,
  trackBlueprintChange: PropTypes.func,
  updateForm: PropTypes.func.isRequired,
  createBlueprintForm: PropTypes.func.isRequired
};
