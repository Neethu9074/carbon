/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { t } from 'in-i18n';

import { BlueprintDescription } from 'in-new-components/Alerting/components/BlueprintDescription';
import LocallyChangedTheme from 'in-themes/LocallyChangedTheme';
import ExpandableCard from 'in-new-components/ExpandableCard';
import Menu from 'in-new-components/Alerting/components/Menu';
import { light } from 'in-themes/themes';

import locals from './BlueprintSelection.mless';

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
    <LocallyChangedTheme theme={light}>
      <ExpandableCard
        label={selectedBlueprintConfig.name}
        title={t('in-new-components:alerting.advanced.selectedBlueprint')}
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
                updateForm(
                  createBlueprintForm(form, blueprintConfig.type, blueprintConfig.thresholdDefaults)
                    .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                    .updateIn(['hiddenFields', 'thresholdValueManuallyChanged'], f => f.setValue(false))
                    .updateIn(['hiddenFields', 'suggestedThresholdValue'], f => f.setValue(null))
                );
              }}
            />
          </div>
        </div>
      </ExpandableCard>
    </LocallyChangedTheme>
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
