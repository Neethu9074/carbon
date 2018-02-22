import React from 'react';

import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import EntityLink from 'in-components/FlowMap/components/Node/EntityLink';
import SvgIcon from 'in-components/SvgIcon';

import locals from './MediumContent.mless';

export default function MediumContent({ data }) {
  return (
    <div className={locals.mediumContent}>
      <div className={locals.header}>
        <SvgIcon className={locals.pluginIcon} type="popup" height={16} color="#6c8a91" />
        <div>
          <EntityLink className={locals.entityLink} data={data} />
          <div className={locals.spacer} />
          <EndpointTypeBadgeList type={data.type} types={data.types} size="sm" />
        </div>
      </div>
      <div className={locals.line} />
      <div className={locals.metrics}>
        <Metric type="change2" value="719" />
        <Metric type="time" value="10ms" />
        <Metric type="error" value="1%" />
      </div>
    </div>
  );
}

function Metric({ type, value }) {
  return (
    <div>
      <SvgIcon className={locals.metricIcon} type={type} height={11} color="#16363e" />
      {value}
    </div>
  );
}
