import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { BlueprintDescription } from 'in-new-components/Alerting/components/BlueprintDescription';
import ExpandableCard from 'in-new-components/ExpandableCard';
import Menu from 'in-new-components/Alerting/components/Menu';

import locals from './BlueprintSelection.mless';

export default function BlueprintSelection({
  blueprintConfig,
  trackBlueprintChange,
  updateFormForSelectedBlueprint,
  form
}) {
  const [config, setConfig] = useState(getConfigByType());
  const [selectButtonDisabled, setSelectButtonDisabled] = useState(true);

  return (
    <ExpandableCard
      label={getConfigByType().name}
      title="Selected Blueprint"
      bodyWithoutPadding
      openByDefault
      darkFrame
    >
      <div className={locals.container}>
        <Menu
          itemLabels={blueprintConfig.map(({ name }) => name)}
          onItemClick={index => {
            setSelectButtonDisabled(false);
            setConfig(blueprintConfig[index]);
            trackBlueprintChange(blueprintConfig[index].type);
          }}
          initialItemSelected={blueprintConfig.findIndex(configTypeEqualsAlertType)}
        />
        <div className={locals.spanTwoColumns}>
          <BlueprintDescription
            config={config}
            selectButtonDisabled={selectButtonDisabled}
            onSelectBlueprintForAlertType={({ alertType }) => {
              setSelectButtonDisabled(true);
              updateFormForSelectedBlueprint(alertType);
            }}
          />
        </div>
      </div>
    </ExpandableCard>
  );

  function getConfigByType() {
    return blueprintConfig.find(configTypeEqualsAlertType);
  }

  function configTypeEqualsAlertType({ type }) {
    return form.get('rule').get('alertType').value === type;
  }
}

BlueprintSelection.propTypes = {
  blueprintConfig: PropTypes.arrayOf(
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
