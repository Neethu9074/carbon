import React from 'react';

import HeaderWithTimeSelection from 'in-new-components/time/TimeSelection/HeaderWithTimeSelection';
import { breadcrumbs$ } from 'in-components/breadcrumb/stores/breadcrumbs';
import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './BreadcrumbHeader.mless';

const separator = (
  <span className={locals.chevron}>
    <SvgIcon className={locals.chevronIcon} type="lib_arrow_expand_right" height={24} />
  </span>
);

export default connectTo(
  {
    breadcrumbs: breadcrumbs$
  },
  function BreadcrumbHeader({ breadcrumbs, useFullAvailableWidth, automaticActiveState = true }) {
    if (breadcrumbs == null || breadcrumbs.length === 0) {
      return null;
    }

    const crumbs = breadcrumbs.reduce((agg, curr) => {
      if (agg.length !== 0) {
        agg.push(separator);
      }

      agg.push(curr);
      return agg;
    }, []);

    // we do not want to require crumb elements to define keys. Therefore we work around React's key check
    // by explicitly stating that these items can only be verified using their index. This also cleans
    // up the HTML structure so that crumb elements can check for :last-child to identify the active
    // crumb element.
    crumbs.unshift({
      className: evaluateClassNames({
        [locals.container]: true,
        [locals.useFullAvailableWidth]: useFullAvailableWidth,
        [locals.highlightLastChild]: automaticActiveState
      })
    });
    crumbs.unshift('div');
    const crumbsElement = React.createElement.apply(React, crumbs);

    return (
      <HeaderWithTimeSelection useFullAvailableWidth={useFullAvailableWidth}>{crumbsElement}</HeaderWithTimeSelection>
    );
  }
);
