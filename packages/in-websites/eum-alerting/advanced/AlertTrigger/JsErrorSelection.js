import PropTypes from 'prop-types';
import React from 'react';

import ProvideManualPatternReadOnly from 'in-websites/eum-alerting/components/ProvideManualPatternReadOnly';
import ProvideManualPattern from 'in-websites/eum-alerting/components/ProvideManualPattern';
import JsErrorsChart from 'in-websites/eum-alerting/components/JsErrorsChart';
import ChartContainer from 'in-websites/eum-alerting/advanced/ChartContainer';
import ExpandableCard from 'in-new-components/ExpandableCard/ExpandableCard';

import locals from './JsErrorSelection.mless';

export default function JsErrorSelection({
  form,
  timeConfig,
  onChange,
  setJsErrorsListVisible,
  granularity,
  isReadOnly
}) {
  let chart = (
    <JsErrorsChart
      form={form}
      onChange={!isReadOnly ? onChange : undefined}
      timeConfig={timeConfig}
      granularity={granularity}
    />
  );

  if (!isReadOnly) {
    chart = <ChartContainer headline="Specific JS Errors (Selection)">{chart}</ChartContainer>;
  }

  return (
    <ExpandableCard
      title="Selected JS Error"
      label="Error rate"
      bodyWithoutPadding
      openByDefault
      darkFrame={!isReadOnly}
      framed={isReadOnly}
      headerClassName={isReadOnly && locals.cardHeader}
    >
      {isReadOnly ? (
        <ProvideManualPatternReadOnly form={form} />
      ) : (
        <ProvideManualPattern
          form={form}
          timeConfig={timeConfig}
          onChange={onChange}
          onSelectJsError={setJsErrorsListVisible}
        />
      )}
      <div className={locals.errorsChart}>{chart}</div>
    </ExpandableCard>
  );
}

JsErrorSelection.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool,
  setJsErrorsListVisible: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired
};
