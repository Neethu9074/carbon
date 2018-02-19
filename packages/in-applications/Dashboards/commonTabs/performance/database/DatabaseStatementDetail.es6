import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import getDatabaseStatement from 'in-subscription/application/getDatabaseStatement';
import { millis, number, percentage } from 'in-services/formatters/number';
import { KpiSection } from 'in-components/Kpis/KpiSection';
import connectTo from 'in-hoc/connectTo';

import locals from 'in-components/Kpis/Kpis.mless';

// Hm, I guess I'm holding this wrong, don't I? The database statement is already present in the performance tab and
// it should not be necessary to load it here again. Then this could be a stateless component. Also, this probably does
// not need to be a standalone view with its own route? Not sure about that.
export default connectTo(
  props => ({
    statementResult: getDatabaseStatement({ id: props.match.params.statementId })
  }),
  function DatabaseStatementDetail({ statementResult }) {
    return (
      <div>
        {(!statementResult || statementResult.loading) && 'Loading...'}
        {statementResult && !!statementResult.error && `Error: ${statementResult.error}`}
        {statementResult && !!statementResult.data && renderStatementData(statementResult.data)}
      </div>
    );
  }
);

function renderStatementData(statmentData) {
  return (
    <MaxWidthFullscreenContainer>
      <KpiSection>
        {/* DOM structure and CSS yoinked from packages/in-components/Kpis/AppKpiPresenter for now */}
        <div className={locals.kpi}>
          <div className={locals.metric}>{number.detailed(statmentData.metrics.calls)}</div>
          <div>Calls</div>
        </div>
        <div className={locals.kpi}>
          <div className={locals.metric}>{millis.detailed(statmentData.metrics.latency)}</div>
          <div>Latency</div>
        </div>
        <div className={locals.kpi}>
          <div className={locals.metric}>{percentage.detailed(statmentData.metrics.errors)}</div>
          <div>Errors</div>
        </div>
      </KpiSection>

      <h3>Statement</h3>
      <div>{statmentData.statement}</div>
    </MaxWidthFullscreenContainer>
  );
}
