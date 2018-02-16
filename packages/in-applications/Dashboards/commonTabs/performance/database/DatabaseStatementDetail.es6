import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import getDatabaseStatement from 'in-subscription/application/getDatabaseStatement';
import { millis, number, percentage } from 'in-services/formatters/number';
import { KpiSection } from 'in-components/Kpis/KpiSection';

import locals from 'in-components/Kpis/Kpis.mless';

// Hm, I guess I'm holding this wrong, don't I? The database statement is already present in the performance tab and
// it should not be necessary to load it here again. Then this could be a stateless component. Also, this probably does
// not need to be a standalone view with its own route? Not sure about that.
export default class extends React.Component {
  static displayName = 'DatabaseStatementDetail';

  constructor(props) {
    super(props);
    this.state = { statementResult: null };
  }

  componentDidMount() {
    this.loadStatement(this.props.match.params.statementId);
  }

  loadStatement(id) {
    getDatabaseStatement({ id }).subscribe(result => {
      this.setState({ statementResult: result });
    });
  }

  render() {
    return this.renderStatementResult(this.state.statementResult);
  }

  renderStatementResult(statementResult) {
    return (
      <div>
        {(!statementResult || statementResult.loading) && 'Loading...'}
        {statementResult && !!statementResult.error && `Error: ${statementResult.error}`}
        {statementResult && !!statementResult.data && this.renderStatementData(statementResult.data)}
      </div>
    );
  }

  renderStatementData(statmentData) {
    return (
      <MaxWidthFullscreenContainer>
        <KpiSection>
          {/* DOM structure and CSS yoinked from packages/in-components/Kpis/AppKpiPresenter for now */}
          <div className={locals.kpi}>
            <div className={locals.metric}>{number.detailed(statmentData.calls)}</div>
            <div>Calls</div>
          </div>
          <div className={locals.kpi}>
            <div className={locals.metric}>{millis.detailed(statmentData.latency)}</div>
            <div>Latency</div>
          </div>
          <div className={locals.kpi}>
            <div className={locals.metric}>{percentage.detailed(statmentData.errors)}</div>
            <div>Errors</div>
          </div>
        </KpiSection>

        <h3>Statement</h3>
        <div>{statmentData.statement}</div>
      </MaxWidthFullscreenContainer>
    );
  }
}
