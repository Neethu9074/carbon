/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Route, Switch } from 'react-router-dom';
import React, { Fragment } from 'react';
import classNames from 'classnames';

import DashboardErroneousResultPresenter from 'in-new-components/DashboardErroneousResultPresenter';
import DefaultLoadingDashboard from 'in-new-components/Loading/DefaultLoadingDashboard';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import ErrorBoundary from 'in-components/ErrorBoundary';
import Title from 'in-components/Title';

import locals from './Switch.mless';

export default function TabSwitch({ tabs, result, hasErrors, location, props, renderErrors }) {
  const isLoading = result && result.progress.loading;

  if (hasErrors) {
    return renderErrors ? renderErrors(result.errors) : <DashboardErroneousResultPresenter errors={result.errors} />;
  } else if (isLoading) {
    return <DefaultLoadingDashboard lightMode />;
  }

  return (
    <Switch>
      {tabs.map(tab => (
        <Route
          key={tab.path}
          path={tab.path}
          render={() => <ViewWrapper tab={tab} data={result ? result.data : null} location={location} props={props} />}
        />
      ))}
    </Switch>
  );
}

function ViewWrapper({ tab, data, location, props }) {
  let content = (
    <div
      className={classNames({
        [locals.content]: true,
        [locals.stickToHeader]: tab.stickToHeader,
        [locals.stickToBottom]: tab.stickToBottom,
        [locals.noTopPadding]: tab.noTopPadding
      })}
    >
      <ViewTrackingMeta
        data={{
          activeTabName: tab.label
        }}
      />
      <tab.component data={data} location={location} {...props} />
    </div>
  );

  if (!tab.isFullWidth) {
    content = <LeftRightPadding>{content}</LeftRightPadding>;
  }

  return (
    <Fragment>
      <Title title={tab.label} />
      <ErrorBoundary name="dashboard content">{content}</ErrorBoundary>
    </Fragment>
  );
}
