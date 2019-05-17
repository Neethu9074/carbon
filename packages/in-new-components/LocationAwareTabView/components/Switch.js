import { Route, Switch } from 'react-router-dom';
import React, { Fragment } from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import DefaultLoadingDashboard from 'in-applications/Dashboards/DefaultLoadingDashboard';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import ErrorBoundary from 'in-components/ErrorBoundary';
import Title from 'in-components/Title';
import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Switch.mless';

export default function TabSwitch({ tabs, result, location, props, renderErrors }) {
  const isLoading = result && result.progress.loading;
  const hasErrors = result && result.errors.length > 0;

  if (hasErrors) {
    return (
      <MaxWidthFullscreenContainer>
        {renderErrors ? (
          renderErrors(result.errors)
        ) : (
          <ErroneousResultPresenter errors={result.errors} className={locals.error} />
        )}
      </MaxWidthFullscreenContainer>
    );
  } else if (isLoading) {
    return <DefaultLoadingDashboard />;
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
      className={evaluateClassNames({
        [locals.content]: true,
        [locals.stickToHeader]: tab.stickToHeader,
        [locals.stickToBottom]: tab.stickToBottom
      })}
    >
      <tab.component data={data} location={location} {...props} />
    </div>
  );

  if (!tab.isFullWidth) {
    content = <MaxWidthFullscreenContainer>{content}</MaxWidthFullscreenContainer>;
  }

  return (
    <Fragment>
      <Title title={tab.label} />
      <ErrorBoundary name="dashboard content">{content}</ErrorBoundary>
    </Fragment>
  );
}
