/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';
import { t } from '@instana/i18n-react';

import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import { breadcrumbs$ } from 'in-components/breadcrumb/stores/breadcrumbs';

import locals from './BreadcrumbHeader.mless';

const separator = <SvgIcon className={locals.chevronIcon} type="lib_arrow_expand_right" size="s" />;

export default function BreadcrumbHeader({ automaticActiveState = true }) {
  const breadcrumbs = useObservable(breadcrumbs$, []);
  if (breadcrumbs == null || breadcrumbs.length === 0) {
    return null;
  }

  const crumbs = breadcrumbs.reduce<React.ReactNode[]>((agg, curr) => {
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
    className: classNames({
      [locals.container]: true,
      [locals.highlightLastChild]: automaticActiveState
    })
  });
  crumbs.unshift('div');
  // @ts-expect-error -- This is cursed I'm not going to type it correctly. Effectively crumbs looks like this here [type, props, ...children]
  const crumbsElement = React.createElement.apply(React, crumbs);

  return (
    <DashboardHeaderModule withTopBorder={false} withBottomBorder>
      <div aria-label={t('in-components:pageStructure.breadcrumbAriaLabel')} className={locals.wrapper}>
        {crumbsElement}
      </div>
    </DashboardHeaderModule>
  );
}
