// @flow
import { Route, Switch } from 'react-router-dom';
import type { ComponentType } from 'react';
import React, { Fragment } from 'react';

import { SideNavigation, SideNavigationItem } from 'in-new-components/SideNavigation/SideNavigation';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash/RedirectWithHash';
import StickySidebarContainer from 'in-new-components/layout/StickySidebarContainer';
import { getModifiedUrlStream, isView } from 'in-stores/navigation';
import { scrollToTopSmoothly } from 'in-services/util/dom';
import { combineLatest } from 'reactive-observables';
import connectTo from 'in-hoc/connectTo';

export type NavigationTree = Array<NavigationTreeItem>;

export interface NavigationTreeItem {
  title?: string;
  pages: Array<Page>;
}

export interface Page {
  path: string;
  label?: string;
  renderLabel?: Function;
  icon?: string;
  component: ComponentType<*>;
  subPages?: Array<SubPage>;
}

export interface SubPage {
  path: string;
  component: ComponentType<*>;
}

type Props = {
  location: any,
  navigationTree: NavigationTree,
  sidebarWidth?: number,
  redirectToDefaultPage: string,
  redirectFrom: string,
  NotFoundPage?: ComponentType<*>
};

/**
 * Takes a single array of pages and converts it into a navigation tree.
 */
export function singletonNavigationTree(pages: Array<Page>, title?: string): NavigationTree {
  return [
    {
      title,
      pages
    }
  ];
}

export default function SideNavigationAndContent(props: Props) {
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

function SideNavigationPane({ navigationTree, hasIcons, ...otherProps }: any) {
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
    const isSubViewObservables = subPages.map(subPage => isView(subPage.path));
    return combineLatest([isMainView$, ...isSubViewObservables]).map(results => {
      return results.find(Boolean);
    });
  } else {
    return isMainView$;
  }
}

function ContentPane({ pages, ...props }) {
  const { NotFoundPage } = props;
  return (
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
  );
}
