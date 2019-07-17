import React, { Fragment } from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import GraphLoadingIndicator from 'in-components/graphView/components/GraphLoadingIndicator';
import Explanation from 'in-components/graphView/components/Explanation';
import Universe from 'in-components/graphView/components/Universe';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import Title from 'in-components/Title';

import './GraphView.less';

const block = 'in-graph-view';

export default function GraphView() {
  return (
    <Fragment>
      <FullHeightWrapper
        render={height => {
          if (!height) {
            return <div className={block + '__full-height-wrapper'} />;
          }
          return (
            <div className={block} style={{ height }}>
              <Title title="Graph" />
              <Universe className={block + '__universe'} />
              <Explanation />
              <GraphLoadingIndicator />
            </div>
          );
        }}
      />
      <DisabledBodyScroll />
    </Fragment>
  );
}
