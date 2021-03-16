/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import EntityOpenIssuesList from 'in-new-components/EntityHealthIndicator/EntityOpenIssuesList';
import Overlay from 'in-new-components/overlays/Overlay';
import { t } from 'in-i18n';

import locals from './EntityHealthIndicator.mless';

export default function EntityHealthIndicator(props) {
  const { openIssues, maxSeverity } = props;

  if (openIssues == null || openIssues < 0) {
    return null;
  }

  if (openIssues === 0) {
    return (
      <props.IndicatorPresenter
        showCheckAsNeutral
        maxSeverity={maxSeverity}
        openIssues={
          props.inContentArea ? openIssues : t('in-new-components:entityHealthIndicator.indicatorPresenterNoIssues')
        }
      />
    );
  }

  return (
    <Overlay props={props} content={Content} withoutWrapper inContentArea={props.inContentArea}>
      {Indicator}
    </Overlay>
  );
}

function Indicator({ openIssues, maxSeverity, IndicatorPresenter, refSetter, toggle }) {
  return (
    <IndicatorPresenter
      openIssues={t('in-new-components:entityHealthIndicator.indicatorPresenterOpenIssues', { count: openIssues })}
      maxSeverity={maxSeverity}
      onClick={toggle}
      refSetter={refSetter}
    />
  );
}

function Content(props) {
  return (
    <div className={locals.entityHealthIndicator}>
      <EntityOpenIssuesList {...props} />
    </div>
  );
}
