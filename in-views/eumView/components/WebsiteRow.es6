import React from 'react';

import { getColorBySeverity, getHealthInfoAtFocusedMoment } from 'in-stores/events';
import WebsiteIssueButton from 'in-views/eumView/components/WebsiteIssueButton';
import connectTo from 'in-hoc/connectTo';

import './WebsiteRow.less';

export default connectTo(
  props => {
    return {
      healthInfo: getHealthInfoAtFocusedMoment(props.snapshotId)
    };
  },
  function WebsiteRow({ data, healthInfo, snapshotId, onClick }) {
    const maxSeverity = healthInfo.get('maxSeverity');
    const color = getColorBySeverity(maxSeverity);
    const numberOfOpenIssues = healthInfo.get('numberOfOpenEvents');

    const block = 'in-website-table-row';
    const metrics = `${block}__metrics`;
    const nameElement = `${block}__name`;
    const detailsElement = `${nameElement}__details`;
    const kpis = `${block}__kpis`;
    const kpiContainer = `${kpis}__container`;
    const kpiElement = `${kpis}__kpi`;
    const kpiElementBold = `${kpiElement} ${kpiElement}__bold`;

    return (
      <div key={data.name} className={block} onClick={onClick}>
        <div className={nameElement}>
          <div>{data.name}</div>
          <div className={detailsElement}>Details</div>
        </div>

        <div className={metrics}>
          <div className={kpis}>
            <div className={kpiContainer}>
              <span className={kpiElementBold}>
                {data.pageLoad ? data.pageLoad : '--'}
              </span>
              <span className={kpiElement}>
                {data.loadTime ? data.loadTime : '--'}
              </span>
              <span className={kpiElement}>
                {data.errors ? data.errors : '--'}
              </span>
            </div>
            <div>
              {numberOfOpenIssues > 0
                ? <WebsiteIssueButton color={color} openIssues={numberOfOpenIssues} snapshotId={snapshotId} />
                : null}
            </div>
          </div>
          <div>
            <img
              height="60px"
              width="99%"
              src="http://c.finanzen.net/chart.gfx?chartType=1&time=10000&height=500&width=960&symbol=DE000LEG1110&exchangeId=2&volumeUnit=1&gridGlobalOff=0"
            />
          </div>
        </div>
      </div>
    );
  }
);
