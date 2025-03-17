/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Route, Switch } from 'react-router-dom';
import { useRouteMatch } from 'react-router';
import React, { Fragment } from 'react';

import { CarbonSideNavItems, CarbonSideNavLink, SvgIcon, Typography } from '@instana/components';
import { combineLatest } from '@instana/observables';

import { isViewWithRouteParam } from 'in-components/layout/SideNavigationAndContent/routing';
import SidebarContainer from 'in-components/layout/SidebarContainer/SidebarContainer';
import StickySidebarContainer from 'in-components/layout/StickySidebarContainer';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import RedirectWithHash from 'in-components/RedirectWithHash';
import { scrollToTopSmoothly } from 'in-services/util/dom';
import { isView } from 'in-stores/navigation';
import Footer from 'in-components/Footer';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './SideNavigationAndContent.mless';

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

  const SideNavRenderer = CarbonSideNavigationPane;

  const sidebar = <SideNavRenderer navigationTree={navigationTree} hasIcons={sideNavigationHasIcons} {...props} />;
  if (stickySidebar)
    return (
      <StickySidebarContainer sidebar={sidebar} sidebarWidth={sidebarWidth}>
        <ContentPane pages={allContentPages} {...props} />
      </StickySidebarContainer>
    );
  return (
    <SidebarContainer sidebar={sidebar} sidebarWidth={sidebarWidth}>
      <ContentPane pages={allContentPages} {...props} />
    </SidebarContainer>
  );
}

export function CarbonSideNavigationPane({ navigationTree, ...otherProps }) {
  const { location, createHref } = useNavigation();
  return navigationTree.map((subTree, idx) => (
    <div key={idx} className={locals.carbonSideNav}>
      <Typography variant="heading-compact-01">
        <div className={locals.title}>{subTree.title}</div>
      </Typography>
      <CarbonSideNavItems>
        {subTree.pages.map(page => {
          const targetNavigationLink = createHref({ ...location, pathname: page.path });
          const options = {
            // For CarbonSideNavLink:
            onClick: scrollToTopSmoothly,
            href: targetNavigationLink,
            // For isActive:
            subPages: page.subPages,
            path: page.path
          };
          if (page.icon) {
            options.renderIcon = () => <SvgIcon size="s" type={page.icon} />;
          }
          return (
            <CarbonSideNavLinkWithActive key={page.path} {...options}>
              {page.label ? page.label : page.renderLabel(otherProps)}
            </CarbonSideNavLinkWithActive>
          );
        })}
      </CarbonSideNavItems>
    </div>
  ));
}

const CarbonSideNavLinkWithActive = connectTo(
  ({ path, subPages }) => ({ isActive: isActive(path, subPages) }),
  props => {
    const newProps = {
      renderIcon: props.renderIcon,
      children: props.children,
      onClick: props.onClick,
      href: props.href,
      isActive: props.isActive
    };
    return <CarbonSideNavLink {...newProps} />;
  }
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
            <Route key={page.path} exact path={page.path}>
              <RenderWithMatchRouteProp
                render={({ match }) => {
                  return <page.component {...props} match={match} />;
                }}
              />
            </Route>
          );
        })}
        <Route path="*">
          {NotFoundPage ? <NotFoundPage /> : t('in-components:layout.sideNavigationAndContentRouteNotFound')}
        </Route>
      </Switch>
      <Footer />
    </Fragment>
  );
}

function RenderWithMatchRouteProp({ render }) {
  const match = useRouteMatch();

  return render({
    match
  });
}
