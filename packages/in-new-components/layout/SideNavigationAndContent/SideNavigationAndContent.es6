// @flow
import { Route, Switch } from 'react-router-dom';
import type { ComponentType } from 'react';
import React, { Fragment } from 'react';

import { SideNavigation, SideNavigationItem } from 'in-new-components/SideNavigation/SideNavigation';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash/RedirectWithHash';
import StickySidebarContainer from 'in-new-components/layout/StickySidebarContainer';
import { getModifiedUrlStream, isView } from 'in-stores/navigation';
import { scrollToTopSmoothly } from 'in-services/util/dom';
import connectTo from 'in-hoc/connectTo';

export type NavigationTree = Array<NavigationTreeItem>;

export interface NavigationTreeItem {
  title: string;
  pages: Array<Page>;
}

export interface Page {
  path: string;
  label: string;
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
  redirectToDefaultPage: string,
  redirectFrom: string,
  NotFoundPage?: ComponentType<*>
};

export default function SideNavigationAndContent(props: Props) {
  const { location, navigationTree, redirectToDefaultPage, redirectFrom } = props;

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
            />
          ))}
        </SideNavigation>
      ))}
    </Fragment>
  );
}

const SideNavigationItemWithActiveFlag = connectTo(
  // The isActive check currently takes a short cut - it will mark a menu item as active if the current path _starts
  // with_ the path for the navigation tree item. With nicely structured URLs this is good enough.
  ({ path }) => ({ isActive: isView(pathname => pathname.indexOf(path) === 0) }),
  SideNavigationItem
);

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
