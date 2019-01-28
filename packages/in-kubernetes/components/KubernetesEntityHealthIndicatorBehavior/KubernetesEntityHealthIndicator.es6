import React from 'react';

import KubernetesEntityOpenIssuesList from 'in-kubernetes/components/KubernetesEntityHealthIndicatorBehavior/KubernetesEntityOpenIssuesList';
import Overlay from 'in-new-components/overlays/Overlay';

export default function KubernetesEntityHealthIndicator(props) {
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

function Indicator({ openIssues, maxSeverity, IndicatorPresenter, refSetter, toggle }) {
  return (
    <IndicatorPresenter openIssues={openIssues} maxSeverity={maxSeverity} onClick={toggle} refSetter={refSetter} />
  );
}

function Content(props) {
  return <KubernetesEntityOpenIssuesList {...props} />;
}
