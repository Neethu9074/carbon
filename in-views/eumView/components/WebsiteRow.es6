import React from 'react';

import './WebsiteRow.less';

export default function WebsiteRow({ data, onClick }) {
  const block = 'in-website-table-row';
  const nameElement = `${block}__name`;
  const detailsElement = `${nameElement}__details`;
  const kpis = `${block}__kpis`;
  const kpiContainer = `${kpis}__container`;
  const kpiElement = `${kpis}__kpi`;

  return (
    <div key={data.name} className={block} onClick={onClick}>
      <div className={nameElement}>
        <div>{data.name}</div>
        <div className={detailsElement}>Details</div>
      </div>
      <div className={kpis}>
        <div className={kpiContainer}>
          <span className={kpiElement}>
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
