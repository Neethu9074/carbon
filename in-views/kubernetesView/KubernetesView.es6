import { Switch, Route } from 'react-router-dom';
import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import KubernetesHeading from 'in-views/kubernetesView/components/KubernetesHeading';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import KubernetesClusterTable from 'in-views/kubernetesView/components/KubernetesClusterTable';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { data$ } from 'in-views/kubernetesView/stores/snapshots';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

import './KubernetesView.less';

const block = 'in-kubernetes';
const headerElement = `${block}__header`;

export default connectTo(
  {
    data: data$
  },
  function KubernetesView({ data }) {
    const { snapshotIds, snapshots } = data;

    if (!snapshotIds || !snapshots) {
      return (
        <div>
          <FullscreenOverlayView className={`${block}__fullscreen-overview`}>
            <div className={block}>
              <KubernetesHeading />
              <LoadingIndicator type="dark" />
            </div>
          </FullscreenOverlayView>
        </div>
      );
    }
    return (
      <Switch>
        {DashboardNavigationRoute}

        <Route
          path="/kubernetes"
          render={() => (
            <FullscreenOverlayView className={`${block}__fullscreen-overview`}>
              <Title title="Kubernetes Clusters" />
              <div className={block}>
                <div className={headerElement}>
                  <div>
                    <KubernetesHeading numClusters={snapshots.length} />
                  </div>
                </div>
                <KubernetesClusterTable snapshots={snapshots} />
              </div>
            </FullscreenOverlayView>
          )}
        />
      </Switch>
    );
  }
);
