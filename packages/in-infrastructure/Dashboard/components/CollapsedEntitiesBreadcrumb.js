/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Ul, Li } from '@instana/components';

import PhysicalHierarchyBreadcrumb from 'in-infrastructure/Dashboard/components/PhysicalHierarchyBreadcrumb';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import Overlay from 'in-components/overlays/Overlay';

import locals from './CollapsedEntitiesBreadcrumb.mless';

export default function CollapsedEntitiesBreadcrumb({ ids, light }) {
  if (ids.length === 1) {
    return (
      <PhysicalHierarchyBreadcrumb
        className={classNames({
          [locals.light]: light
        })}
        snapshotId={ids[0]}
      />
    );
  }

  return (
    <Overlay content={ApplicationSwitcher} props={{ ids }}>
      {({ toggle }) => (
        <Breadcrumb className={locals.collapsedBreadcrumb} onClick={toggle}>
          <div
            className={classNames({
              [locals.flexWrapper]: true,
              [locals.light]: light
            })}
          >
            <SvgIcon className={locals.expandIcon} type="lib_menu_more_horizontal" size="s" />({ids.length})
          </div>
        </Breadcrumb>
      )}
    </Overlay>
  );
}

function ApplicationSwitcher({ ids }) {
  const getDashboardLink = useGetDashboardLink();
  return (
    <Ul>
      {ids.map(id => (
        <Li key={id} href={getDashboardLink(id)}>
          <PhysicalHierarchyBreadcrumb className={locals.listBreadcrumb} snapshotId={id} asLink={false} />
        </Li>
      ))}
    </Ul>
  );
}
