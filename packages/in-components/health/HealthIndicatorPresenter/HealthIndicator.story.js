/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { range } from 'lodash';
import React from 'react';

import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';

export default {
  component: HealthIndicatorPresenter
};

export function Presenter() {
  return (
    <>
      <h1>Health Indicator</h1>
      <div>
        <HealthIndicatorPresenter openIssues={0} maxSeverity={0} active /> (active / hover state)
      </div>
      {range(0, 11).map(severity => (
        <div>
          <HealthIndicatorPresenter openIssues={severity} maxSeverity={severity} />
        </div>
      ))}
    </>
  );
}

export function Button() {
  return (
    <>
      <h1>Health Indicator Button</h1>
      <div>
        <HealthIndicatorButtonPresenter openIssues={0} maxSeverity={0} active /> (active / hover state)
      </div>
      {range(0, 11).map(severity => (
        <div>
          <HealthIndicatorButtonPresenter openIssues={severity} maxSeverity={severity} />
        </div>
      ))}
    </>
  );
}

export function IconOnly() {
  return (
    <>
      <h1>Health Indicator (Icon Only, no tooltip, no hover state)</h1>
      {range(0, 11).map(severity => (
        <div>
          <HealthIndicatorPresenter openIssues={severity} maxSeverity={severity} iconOnly />
        </div>
      ))}
      <div>
        <HealthIndicatorPresenter openIssues={0} maxSeverity={0} active iconOnly iconOnlySize="xxs" /> (size=xxs)
        <HealthIndicatorPresenter openIssues={0} maxSeverity={0} active iconOnly iconOnlySize="xs" /> (size=xs)
        <HealthIndicatorPresenter openIssues={0} maxSeverity={0} active iconOnly iconOnlySize="s" /> (size=s)
        <HealthIndicatorPresenter openIssues={0} maxSeverity={0} active iconOnly iconOnlySize="regular" /> (size=regular)
        <HealthIndicatorPresenter openIssues={0} maxSeverity={0} active iconOnly iconOnlySize="l" /> (size=l)
        <HealthIndicatorPresenter openIssues={0} maxSeverity={0} active iconOnly iconOnlySize="xl" /> (size=xl)
        <HealthIndicatorPresenter openIssues={0} maxSeverity={0} active iconOnly iconOnlySize="xxl" /> (size=xxl)
        <HealthIndicatorPresenter openIssues={0} maxSeverity={0} active iconOnly iconOnlySize="xxxl" /> (size=xxxl)
      </div>
    </>
  );
}
