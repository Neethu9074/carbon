import React from 'react';

import './WebsiteKpiSection.less';

const block = 'in-website-kpi-section';

export default function WebsiteKpiSection({ data }) {
  return (
    <div className={block}>
      <Kpi metricName="Views" classNameAppendix="__load">
        {data.pageLoad}
      </Kpi>
      <Kpi metricName="Load Time" classNameAppendix="__time">
        {data.loadTime}
      </Kpi>
    </div>
  );
}

function Kpi({ metricName, children, classNameAppendix }) {
  const kpi = `${block}__kpi ${block}__kpi`;
  return (
    <div className={`${block}__kpi-block`}>
      <span className={`${block}__metric-name ${block}__metric-name${classNameAppendix}`}>
        {metricName}
      </span>
      <span className={`${kpi}${classNameAppendix}`}>
        {children}
      </span>
    </div>
  );
}
