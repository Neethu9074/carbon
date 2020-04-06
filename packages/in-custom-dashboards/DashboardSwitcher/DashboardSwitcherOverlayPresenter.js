import React, { useState } from 'react';
import rpt from 'prop-types';

import { Ul, Li, LoadingSkeletonLi, HorizontalIndicatorLi } from 'in-new-components/lists/List';
import { isNotBlank, compareIgnoreCase, containsIgnoreCase } from 'in-services/util/string';
import { getCustomDashboardLink } from 'in-custom-dashboards/navigation/url';
import InlineTabNavigation from 'in-new-components/InlineTabNavigation';
import { indeterminateProgress } from 'in-services/fixedObjects';
import { cockpitLink$ } from 'in-cockpit/navigation/paths';
import SearchInput from 'in-new-components/SearchInput';
import { noop } from 'in-services/util/function';
import Button from 'in-new-components/Button';

import locals from './DashboardSwitcherOverlayPresenter.mless';

export default function DashboardSwitcherOverlayPresenter({
  customDashboards,
  isLoadingMore,
  onCreateNewDashboard,
  close
}) {
  const [query, setQuery] = useState('');

  return (
    <div className={locals.overlay}>
      <Ul>
        <Li className={locals.actions}>
          <SearchInput placeholder="Search" query={query} onChange={q => setQuery(q)} />

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

        <Li href$={cockpitLink$}>System Overview</Li>

        {(isLoadingMore || customDashboards.length > 0) && (
          <Li noAlternatingBg className={locals.tabs}>
            <InlineTabNavigation
              activeTabIndex={0}
              onTabSelect={noop}
              tabList={[
                {
                  text: 'All Dashboards'
                }
              ]}
            />
          </Li>
        )}

        {isLoadingMore && <HorizontalIndicatorLi progress={indeterminateProgress} />}
        <DashboardList customDashboards={customDashboards} query={query} />
        {isLoadingMore && <LoadingSkeletonLi />}
      </Ul>
    </div>
  );
}

DashboardSwitcherOverlayPresenter.propTypes = {
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

function DashboardList({ customDashboards, query }) {
  if (!customDashboards) {
    return null;
  }

  let items = customDashboards.slice();
  if (isNotBlank(query)) {
    items = items.filter(({ title }) => containsIgnoreCase(title, query));
  }
  items = items.sort((a, b) => compareIgnoreCase(a.title, b.title));

  return (
    <>
      {items.map(({ id, title }) => (
        <Li key={id} href$={getCustomDashboardLink(id)}>
          {title}
        </Li>
      ))}
    </>
  );
}
