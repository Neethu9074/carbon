/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Redirect, Route, Switch } from 'react-router-dom';
import React, { Fragment } from 'react';
import classNames from 'classnames';

import { Result, Error } from '@instana/types';

import DashboardErroneousResultPresenter from 'in-components/DashboardErroneousResultPresenter';
import DefaultLoadingDashboard from 'in-components/Loading/DefaultLoadingDashboard';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { Tab } from 'in-components/LocationAwareTabView/types';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import ErrorBoundary from 'in-components/ErrorBoundary';
import { Location } from 'in-stores/navigation/types';
import Title from 'in-components/Title';
import { Nullish } from 'in-types';

import locals from './Switch.mless';

interface TabSwitchProps<TabData, TabProps extends {}> {
  tabs: Tab<TabData, TabProps>[];
  result: Result<TabData> | Nullish;
  props: TabProps | undefined;
  hasErrors?: boolean;
  location: Location;
  renderErrors?: (errors: Error[]) => JSX.Element;
  renderLoading?: () => JSX.Element;
}

export default function TabSwitch<TabData, TabProps extends {} = {}>({
  tabs,
  result,
  hasErrors,
  location,
  props,
  renderErrors,
  renderLoading
}: TabSwitchProps<TabData, TabProps>) {
  const isLoading = result && result.progress.loading;

  if (result && hasErrors) {
    return renderErrors ? renderErrors(result.errors) : <DashboardErroneousResultPresenter errors={result.errors} />;
  } else if (isLoading) {
    return renderLoading ? renderLoading() : <DefaultLoadingDashboard />;
  }

  return (
    <Switch>
      {tabs.map(tab => (
        <Route key={tab.path} path={tab.path}>
          <h2 className="cds--assistive-text">{tab.label}</h2>
          <ViewWrapper<TabData, TabProps>
            tab={tab}
            data={result ? result.data : null}
            location={location}
            props={props ?? ({} as TabProps)}
          />
        </Route>
      ))}
      <Route>
        <RedirectOnNoActiveTab tabs={tabs} location={location} />
      </Route>
    </Switch>
  );
}

type ViewWrapperProps<TabData, TabProps extends {}> = {
  tab: Tab<TabData, TabProps>;
  data: TabData | Nullish;
} & Pick<TabSwitchProps<TabData, TabProps>, 'location' | 'props'>;
function ViewWrapper<TabData, TabProps extends {}>({
  tab,
  data,
  location,
  props
}: ViewWrapperProps<TabData, TabProps>) {
  // uppercasing for treating it as a react component
  const { topBanner: TopBanner } = tab;

  let content = (
    <div
      className={classNames({
        [locals.content]: true,
        [locals.bottomMargin]: !tab.noBottomMargin,
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
      <tab.component data={data} location={location} {...(props as TabProps)} />
    </div>
  );

  if (!tab.isFullWidth) {
    content = <LeftRightPadding>{content}</LeftRightPadding>;
  }

  return (
    <Fragment>
      <Title title={tab.label} />
      <ErrorBoundary name="dashboard content">
        {TopBanner && <TopBanner />}
        {content}
      </ErrorBoundary>
    </Fragment>
  );
}

interface RedirectOnNoActiveTabProps {
  tabs: { path: string }[];
  location: Location;
}
function RedirectOnNoActiveTab({ tabs, location }: RedirectOnNoActiveTabProps) {
  for (const tab of tabs) {
    if (location && location.pathname.indexOf(tab.path) === 0) {
      return null;
    }
  }
  return <Redirect to={tabs[0].path} />;
}
