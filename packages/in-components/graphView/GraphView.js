/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import GraphLoadingIndicator from 'in-components/graphView/components/GraphLoadingIndicator';
import Explanation from 'in-components/graphView/components/Explanation';
import Universe from 'in-components/graphView/components/Universe';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import './GraphView.less';

const block = 'in-graph-view';

export default function GraphView() {
  useDisabledBodyScroll();

  return (
    <FullHeightWrapper
      render={height => {
        if (!height) {
          return <div className={block + '__full-height-wrapper'} />;
        }
        return (
          <div className={block} style={{ height }}>
            <Title title={t('in-components:graphView.graphTitle')} />
            <Universe className={block + '__universe'} />
            <Explanation />
            <GraphLoadingIndicator />
          </div>
        );
      }}
    />
  );
}
