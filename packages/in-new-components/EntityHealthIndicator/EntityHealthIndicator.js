import React from 'react';

import EntityOpenIssuesList from 'in-new-components/EntityHealthIndicator/EntityOpenIssuesList';
import Overlay from 'in-new-components/overlays/Overlay';

import locals from './EntityHealthIndicator.mless';

export default function EntityHealthIndicator(props) {
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
  return (
    <div className={locals.entityHealthIndicator}>
      <EntityOpenIssuesList {...props} />
    </div>
  );
}
