import React from 'react';

import KubernetesEntityOpenIssuesList from 'in-kubernetes/components/KubernetesEntityHealthIndicatorBehavior/KubernetesEntityOpenIssuesList';
import getKubernetesEntityHealthInfo from 'in-subscription/kubernetes/getKubernetesEntityHealthInfo';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import Overlay from 'in-new-components/overlays/Overlay';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ clusterId, namespaceId, deploymentId, podId, nodeId, timeConfig }) => {
    const healthInfo$ = getKubernetesEntityHealthInfo({
      filter: {
        clusterId,
        namespaceId,
        deploymentId,
        podId,
        nodeId,
        timeConfig
      }
    }).filter(healthInfo => healthInfo.data != null);

    return {
      openIssues: healthInfo$.map(result => result.data.openIssues.length),
      maxSeverity: healthInfo$.map(result => result.data.maxSeverity),
      timeConfig: healthInfo$.map(result => getTimeConfigAlignedToResultTime(timeConfig, result))
    };
  },
  function KubernetesEntityHealthIndicatorBehavior(props) {
    const { openIssues, showOkayOnNoIssues = true } = props;
    if (openIssues == null || openIssues < 0) {
      return null;
    }

    if (openIssues === 0) {
      return showOkayOnNoIssues ? <props.IndicatorPresenter openIssues={openIssues} /> : null;
    }

    return (
      <Overlay props={props} content={Content} withoutWrapper inContentArea={props.inContentArea}>
        {Indicator}
      </Overlay>
    );
  }
);

function Indicator({ openIssues, maxSeverity, IndicatorPresenter, refSetter, toggle }) {
  return (
    <IndicatorPresenter openIssues={openIssues} maxSeverity={maxSeverity} onClick={toggle} refSetter={refSetter} />
  );
}

function Content(props) {
  return <KubernetesEntityOpenIssuesList {...props} />;
}
