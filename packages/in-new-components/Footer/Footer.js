import { withRouter } from 'react-router';
import connectTo from 'in-hoc/connectTo';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { shouldShowFloatingFooter } from 'in-services/zendesk';

import locals from './Footer.mless';

export default withRouter(
  connectTo(props => {
    return {
      hasFloatingFooter: shouldShowFloatingFooter().map(zendeskButtonVisible => {
        const { pathname } = props.location;
        const isOnWebsiteDashboards =
          pathname !== '/websiteMonitoring/websites' && pathname.includes('/websiteMonitoring/website');
        return zendeskButtonVisible || isOnWebsiteDashboards;
      })
    };
  })(Footer)
);

function Footer({ hasFloatingFooter, smallMargin = false }) {
  if (!hasFloatingFooter) return null;

  return (
    <footer
      className={evaluateClassNames({
        [locals.footer]: true,
        [locals.smallMargin]: smallMargin
      })}
    />
  );
}
