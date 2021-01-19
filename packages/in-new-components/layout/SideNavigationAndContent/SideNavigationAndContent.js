/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Route, Switch } from 'react-router-dom';
import { combineLatest } from '@instana/observables';
import React, { Fragment } from 'react';

import { SideNavigation, SideNavigationItem } from 'in-new-components/SideNavigation/SideNavigation';
import RedirectWithHash from 'in-components/RedirectWithHash';
import { getModifiedUrlStream, isView, isViewWithRouteParam } from 'in-stores/navigation';
import StickySidebarContainer from 'in-new-components/layout/StickySidebarContainer';
import { scrollToTopSmoothly } from 'in-services/util/dom';
import Footer from 'in-new-components/Footer';
import connectTo from 'in-hoc/connectTo';

/**
 * Takes a single array of pages and converts it into a navigation tree.
 */
export function singletonNavigationTree(pages, title) {
  if (title) {
    return [
      {
        title,
        pages
      }
    ];
  } else {
    return [{ pages }];
  }
}

export default function SideNavigationAndContent(props) {
  const { location, navigationTree, sidebarWidth, stickySidebar, redirectToDefaultPage, redirectFrom } = props;

  if (redirectToDefaultPage && redirectFrom && location && location.pathname === redirectFrom) {
    return <RedirectWithHash props={props} to={redirectToDefaultPage} />;
  }

  // Gather all pages. Pages are
  // 1. Leaves in the navigation tree, as well as
  // 2. Sub pages of those leaves that do not appear visually in the navigation tree but can still be shown in the
  // content pane (for example by selecting an item in a list for editing its details or by creating a new entity by
  // clicking on a "Create New Xxx" button).
  // These page items contribute to the routes used for the content pane.
  const allContentPages = navigationTree.reduce((accumulatedNavigationTreeLeaves, subTree) => {
    const subPages = subTree.pages.reduce((accumulatedSubPages, page) => {
      return page.subPages ? accumulatedSubPages.concat(page.subPages) : accumulatedSubPages;
    }, []);
    return accumulatedNavigationTreeLeaves.concat(subTree.pages).concat(subPages);
  }, []);

  const sideNavigationHasIcons = navigationTree.find(subTree => subTree.pages.find(page => page.icon));

  return (
    <StickySidebarContainer
      sidebar={<SideNavigationPane navigationTree={navigationTree} hasIcons={sideNavigationHasIcons} {...props} />}
      sidebarWidth={sidebarWidth}
      stickySidebar={stickySidebar}
    >
      <ContentPane pages={allContentPages} {...props} />
    </StickySidebarContainer>
  );
}

function SideNavigationPane({ navigationTree, hasIcons, ...otherProps }) {
  return (
    <Fragment>
      {navigationTree.map((subTree, idx) => (
        <SideNavigation title={subTree.title} key={idx}>
          {subTree.pages.map(page => (
            <SideNavigationItemWithActiveFlag
              href$={getModifiedUrlStream(params => {
                params.pathname = page.path;
              })}
              onClick={scrollToTopSmoothly}
              key={page.path}
              icon={page.icon}
              omitEmptyIcon={!hasIcons}
              label={page.label ? page.label : page.renderLabel(otherProps)}
              path={page.path}
              subPages={page.subPages}
              {...otherProps}
            />
          ))}
        </SideNavigation>
      ))}
    </Fragment>
  );
}

const SideNavigationItemWithActiveFlag = connectTo(
  ({ path, subPages }) => ({ isActive: isActive(path, subPages) }),
  SideNavigationItem
);

function isActive(path, subPages) {
  const isMainView$ = isView(pathname => pathname === path);
  if (subPages) {
    const isSubViewObservables = subPages.map(subPage => isViewWithRouteParam(subPage.path));
    // The !! before results.find(Boolean) is required, because [false, false, false].find(Boolean) will evaluate to
    // undefined and an undefined value will not be emitted, so this SideNavigationItem will just stay on its last
    // stale isActive state.
    return combineLatest([isMainView$, ...isSubViewObservables]).map(results => results && !!results.find(Boolean));
  } else {
    return isMainView$;
  }
}

function ContentPane({ pages, ...props }) {
  const { NotFoundPage } = props;
  return (
    <Fragment>
      <Switch>
        {pages.map(page => {
          return (
            <Route
              key={page.path}
              exact
              path={page.path}
              render={({ match }) => <page.component {...props} match={match} />}
            />
          );
        })}
        <Route path="*" render={() => (NotFoundPage ? <NotFoundPage /> : 'Not Found')} />
      </Switch>
      <Footer />
    </Fragment>
  );
}
