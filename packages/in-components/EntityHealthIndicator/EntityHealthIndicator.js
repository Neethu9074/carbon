/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import EntityOpenIssuesList from 'in-components/EntityHealthIndicator/EntityOpenIssuesList';
import Overlay from 'in-components/overlays/Overlay';

import locals from './EntityHealthIndicator.mless';

export default function EntityHealthIndicator(props) {
  const { openIssues, maxSeverity } = props;

  if (openIssues == null || openIssues < 0) {
    return null;
  }

  if (openIssues === 0) {
    return <props.IndicatorPresenter showCheckAsNeutral maxSeverity={maxSeverity} openIssues={openIssues} />;
  }

  return (
    <Overlay props={props} content={Content} withoutWrapper inContentArea={props.inContentArea}>
      {({ toggle, refSetter, isOpen }) => (
        <props.IndicatorPresenter
          openIssues={openIssues}
          maxSeverity={maxSeverity}
          onClick={toggle}
          refSetter={refSetter}
          isOpen={isOpen}
        />
      )}
    </Overlay>
  );
}

function Content(props) {
  return (
    <div className={locals.entityHealthIndicator}>
      <EntityOpenIssuesList {...props} />
    </div>
  );
}
