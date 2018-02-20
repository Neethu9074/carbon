import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import getDatabaseStatement from 'in-subscription/application/getDatabaseStatement';
import { millis, number, percentage } from 'in-services/formatters/number';
import BackButton from 'in-sdk/components/dashboard/TabView/BackButton';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { KpiSection } from 'in-components/Kpis/KpiSection';
import { rebuildUrlAndReplace } from './rebuildUrl';
import Title from 'in-components/Title';

import connectTo from 'in-hoc/connectTo';

import locals from 'in-components/Kpis/Kpis.mless';

export default connectTo(
  props => ({
    statementResult: getDatabaseStatement({ id: props.match.params.statementId })
  }),
  function DatabaseStatementDetail({ statementResult, location }) {
    return (
      <div>
        {(!statementResult || statementResult.loading) && 'Loading...'}
        {statementResult && !!statementResult.error && `Error: ${statementResult.error}`}
        {statementResult && !!statementResult.data && renderStatementData(statementResult.data, location)}
      </div>
    );
  }
);

function renderStatementData(statmentData, location) {
  return (
    <MaxWidthFullscreenContainer>
      <Title title="Database Statement Details" />
      <BackButton
        label="Back"
        href={rebuildUrlAndReplace(location, path => path.replace(/\/database\/statements\/.*/, ''))}
      />

      <DashboardTile title="Statement Metrics">
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
      </DashboardTile>

      <DashboardTile title="Statement">
        <div>{statmentData.statement}</div>
      </DashboardTile>
    </MaxWidthFullscreenContainer>
  );
}
