/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { BlueprintDescription } from 'in-new-components/Alerting/components/BlueprintDescription';
import LocallyChangedTheme from 'in-themes/LocallyChangedTheme';
import ExpandableCard from 'in-new-components/ExpandableCard';
import Menu from 'in-new-components/Alerting/components/Menu';
import { light } from 'in-themes/themes';

import locals from './BlueprintSelection.mless';

export default function BlueprintSelection({
  blueprintConfigs,
  trackBlueprintChange,
  updateFormForSelectedBlueprint,
  form
}) {
  const alertType = form.get('rule').get('alertType').value;
  const selectedBlueprintConfig = blueprintConfigs.find(item => item.type === alertType);

  const [config, setConfig] = useState(selectedBlueprintConfig);
  const [selectButtonDisabled, setSelectButtonDisabled] = useState(true);

  return (
    <LocallyChangedTheme theme={light}>
      <ExpandableCard
        label={selectedBlueprintConfig.name}
        title="Selected Blueprint"
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
                updateFormForSelectedBlueprint(blueprintConfig);
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
  updateFormForSelectedBlueprint: PropTypes.func.isRequired
};
