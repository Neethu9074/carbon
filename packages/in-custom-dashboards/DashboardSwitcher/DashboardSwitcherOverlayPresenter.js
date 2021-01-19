/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';
import rpt from 'prop-types';

import { isLandingPage as isCustomDashboardLandingPage } from 'in-client/js/LandingPage/supportedLandingPages/customDashboards';
import { isLandingPage as isCockpitLandingPage } from 'in-client/js/LandingPage/supportedLandingPages/cockpit';
import { Ul, Li, LoadingSkeletonLi, HorizontalIndicatorLi } from 'in-new-components/lists/List';
import { isNotBlank, compareIgnoreCase, containsIgnoreCase } from 'in-services/util/string';
import { getActiveConfiguration$ } from 'in-client/js/LandingPage/activeConfigration';
import { getCustomDashboardLink } from 'in-custom-dashboards/navigation/url';
import { indeterminateProgress } from 'in-services/fixedObjects';
import { cockpitLink$ } from 'in-cockpit/navigation/paths';
import SearchInput from 'in-new-components/SearchInput';
import Lettering from 'in-components/Lettering';
import Button from 'in-new-components/Button';
import Pill from 'in-new-components/Pill';
import connectTo from 'in-hoc/connectTo';
import theme from 'in-themes';

import locals from './DashboardSwitcherOverlayPresenter.mless';

export default connectTo({
  activeLandingPageConfiguration: getActiveConfiguration$()
})(DashboardSwitcherOverlayPresenter);

function DashboardSwitcherOverlayPresenter({
  customDashboards,
  isLoadingMore,
  onCreateNewDashboard,
  close,
  activeLandingPageConfiguration
}) {
  const [query, setQuery] = useState('');

  return (
    <div className={locals.overlay}>
      <Ul>
        <Li className={locals.actions}>
          <SearchInput placeholder="Search" query={query} onChange={q => setQuery(q)} autoFocus />

          <Button
            kind="action"
            icon="lib_openclose_add_circle_outline"
            className={locals.addDashboard}
            onClick={() => {
              onCreateNewDashboard();
              close();
            }}
          >
            Create Dashboard
          </Button>
        </Li>

        <DashboardList
          customDashboards={customDashboards}
          query={query}
          activeLandingPageConfiguration={activeLandingPageConfiguration}
        />
        {isLoadingMore && <HorizontalIndicatorLi progress={indeterminateProgress} />}
        {isLoadingMore && <LoadingSkeletonLi />}
      </Ul>
    </div>
  );
}

DashboardSwitcherOverlayPresenter.propTypes = {
  // Loaded via connectTo
  activeLandingPageConfiguration: rpt.any,

  isLoadingMore: rpt.bool,
  onCreateNewDashboard: rpt.func.isRequired,
  close: rpt.func.isRequired,
  customDashboards: rpt.arrayOf(
    rpt.shape({
      id: rpt.string.isRequired,
      title: rpt.string.isRequired
    })
  )
};

function DashboardList({ customDashboards, query, activeLandingPageConfiguration }) {
  let items = (customDashboards || [])
    .map(({ id, title }) => ({
      id,
      title,
      isDefault: isCustomDashboardLandingPage(activeLandingPageConfiguration?.pageKey, id),
      href$: getCustomDashboardLink(id)
    }))
    .sort((a, b) => compareIgnoreCase(a.title, b.title));

  // This should always be the first item in the list.
  items.unshift({
    id: 'standard-system-overview',
    title: 'Instana',
    isDefault: isCockpitLandingPage(activeLandingPageConfiguration?.pageKey),
    titleElement: (
      <>
        <Lettering className={locals.lettering} />
        <Pill color={theme.lib.colors.deepPurple800} className={locals.leftMargin}>
          built-in
        </Pill>
      </>
    ),
    href$: cockpitLink$
  });

  if (isNotBlank(query)) {
    items = items.filter(({ title }) => containsIgnoreCase(title, query));
  }

  return (
    <>
      {items.map(({ id, title, titleElement, href$, isDefault }) => (
        <Li key={id} href$={href$} noAlternatingBg>
          <div className={locals.itemContent}>
            {titleElement || title}
            {isDefault && (
              <Pill color={theme.lib.colors.blue800} className={locals.leftMargin}>
                default
              </Pill>
            )}
          </div>
        </Li>
      ))}
    </>
  );
}
