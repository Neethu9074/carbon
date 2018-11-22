import React from 'react';

import KubernetesEntityOpenIssuesList from 'in-kubernetes/components/KubernetesEntityHealthIndicatorBehavior/KubernetesEntityOpenIssuesList';
import Overlay from 'in-new-components/overlays/Overlay';

export default function ApplicationEntityHealthIndicatorBehavior(props) {
  const { openIssues } = props;
  if (openIssues == null || openIssues < 0) {
    return null;
  }

  if (openIssues === 0) {
    return <props.IndicatorPresenter openIssues={openIssues} />;
  }

  return (
    <Overlay props={props} content={Content} withoutWrapper inContentArea>
      {Indicator}
    </Overlay>
  );
}

function Indicator({ openIssues, maxSeverity, IndicatorPresenter, refSetter, toggle }) {
  return (
    <IndicatorPresenter openIssues={openIssues} maxSeverity={maxSeverity} onClick={toggle} refSetter={refSetter} />
  );
}

function Content(props) {
  return <KubernetesEntityOpenIssuesList {...props} />;
}
