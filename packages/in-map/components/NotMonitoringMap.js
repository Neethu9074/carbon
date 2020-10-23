import React from 'react';

import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification/EntityPageMainNotification';
import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import ArticleContent from 'in-new-components/ArticleContent';
import Controls from 'in-map/components/MapOverlayControls';
import { isMonitoring$ } from 'in-stores/isMonitoring';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

import locals from './NotMonitoringMap.mless';

export default connectTo(
  {
    isLive: timeConfig$.map(timeConfig => timeConfig.to === null).distinct(),
    isMonitoring: isMonitoring$
  },
  function NotMonitoringMap({ isMonitoring }) {
    let content;
    if (!isMonitoring) {
      content = <MapNotMonitoring />;
    } else {
      content = <MapNoDataForTimerange />;
    }

    return (
      <FullHeightWrapper
        className={locals.wrapper}
        render={() => {
          return (
            <>
              <CenterAlignmentColumn>{content}</CenterAlignmentColumn>
              <Controls />
            </>
          );
        }}
      />
    );
  }
);

function MapNotMonitoring(props) {
  return <MapMessage title="Not Monitoring" explanation={() => <ArticleContent id="mapNotMonitoring" />} {...props} />;
}

function MapNoDataForTimerange(props) {
  return (
    <MapMessage
      title="No Monitoring Data Found"
      explanation={() => <ArticleContent id="mapNoDataForTimerange" />}
      {...props}
    />
  );
}

function MapMessage(props) {
  return <EntityPageMainNotification framed theme="light" icon="lib_infrastructure" {...props} withBackground />;
}
