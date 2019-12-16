import PropTypes from 'prop-types';
import React from 'react';

import { ProvideManualPattern } from 'in-websites/eum-alerting/components/ProvideManualPattern';
import { fieldNames } from 'in-websites/eum-alerting/data/alertDialogFormDefinition';
import JsErrorsChart from 'in-websites/eum-alerting/components/JsErrorsChart';
import ChartContainer from 'in-websites/eum-alerting/advanced/ChartContainer';
import ExpandableCard from 'in-new-components/ExpandableCard/ExpandableCard';

import locals from './JsErrorSelection.mless';

export default function JsErrorSelection({ form, timeConfig, onChange, setJsErrorsListVisible, granularity }) {
  return (
    <div>
      <ExpandableCard
        label="Selected Error"
        title={form.get(fieldNames.ruleValue).value}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <ProvideManualPattern
          form={form}
          timeConfig={timeConfig}
          onChange={onChange}
          onSelectJsError={setJsErrorsListVisible}
        />
        <div className={locals.errorsChart}>
          <ChartContainer headline="Specific JS Errors (Selection)">
            <JsErrorsChart form={form} onChange={onChange} timeConfig={timeConfig} granularity={granularity} />
          </ChartContainer>
        </div>
      </ExpandableCard>
    </div>
  );
}

JsErrorSelection.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  setJsErrorsListVisible: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired
};
