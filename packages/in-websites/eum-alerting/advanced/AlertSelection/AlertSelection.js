import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { AlertTypeDescription } from 'in-websites/eum-alerting/components/AlertTypeDescription';
import { alertTypeConfig } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import { websitesAlertingBlueprintChanged } from 'in-websites/eum-alerting/tracker';
import { modeAdvanced } from 'in-websites/eum-alerting/constants';
import ExpandableCard from 'in-new-components/ExpandableCard';
import evaluateClassNames from 'in-services/util/classnames';
import Menu from 'in-websites/eum-alerting/components/Menu';

import locals from './AlertSelection.mless';

const subMenuLabels = [];

export default function AlertSelection({ form, updateForm }) {
  const [config, setConfig] = useState(getConfigByType(form));
  const [selectButtonDisabled, setSelectButtonDisabled] = useState(true);

  return (
    <ExpandableCard
      label={getConfigByType(form).name}
      title="Selected Blueprint"
      bodyWithoutPadding
      openByDefault
      darkFrame
    >
      <div className={locals.container}>
        <Menu
          itemLabels={alertTypeConfig.map(({ name }) => name)}
          itemClickTracker={index => {
            setSelectButtonDisabled(false);
            setConfig(alertTypeConfig[index]);
            websitesAlertingBlueprintChanged({ newBluePrint: alertTypeConfig[index].type, mode: modeAdvanced });
          }}
          initialItemSelected={alertTypeConfig.findIndex(
            ({ type }) => form.get('rule').get('alertType').value === type
          )}
        />
        {subMenuLabels.length > 0 && <Menu itemLabels={subMenuLabels} itemClickTracker={() => {}} />}
        <div
          className={evaluateClassNames({
            [locals.spanTwoColumns]: subMenuLabels.length === 0
          })}
        >
          <AlertTypeDescription
            form={form}
            updateForm={updateForm}
            config={config}
            selectButtonDisabled={selectButtonDisabled}
            setSelectButtonDisabled={setSelectButtonDisabled}
          />
        </div>
      </div>
    </ExpandableCard>
  );
}

AlertSelection.propTypes = {
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired
};

function getConfigByType(form) {
  return alertTypeConfig.find(({ type }) => form.get('rule').get('alertType').value === type);
}
