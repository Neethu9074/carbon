import { Route, Switch } from 'react-router-dom';
import React, { Fragment } from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import DefaultLoadingDashboard from 'in-applications/Dashboards/DefaultLoadingDashboard';
import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import ErrorBoundary from 'in-components/ErrorBoundary';
import Title from 'in-components/Title';

import locals from './Switch.mless';

export default function TabSwitch({ tabs, result, location, props }) {
  const isLoading = result.progress.loading;
  const hasErrors = result.errors.length > 0;

  if (hasErrors) {
    return (
      <MaxWidthFullscreenContainer>
        <ErroneousResultPresenter errors={result.errors} className={locals.error} />
      </MaxWidthFullscreenContainer>
    );
  } else if (isLoading) {
    return <DefaultLoadingDashboard />;
  }

  return (
    <Switch>
      {tabs.map(tab => {
        return (
          <Route
            key={tab.path}
            path={tab.path}
            render={() => <ViewWrapper tab={tab} data={result.data} location={location} props={props} />}
          />
        );
      })}
    </Switch>
  );
}

function ViewWrapper({ tab, data, location, props }) {
  let content = <tab.component data={data} location={location} {...props} />;

  if (!tab.isFullWidth) {
    content = <MaxWidthFullscreenContainer>{content}</MaxWidthFullscreenContainer>;
  }

  if (!tab.stickToHeader) {
    content = (
      <Fragment>
        <div style={{ height: 16 }} />
        {content}
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Title title={tab.label} />
      <ErrorBoundary name="dashboard content">{content}</ErrorBoundary>
    </Fragment>
  );
}
