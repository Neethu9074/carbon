import React from 'react';

import PhysicalHierarchyBreadcrumb from 'in-infrastructure/Dashboard/components/PhysicalHierarchyBreadcrumb';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { evaluateClassNames } from 'in-services/util/classnames';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import Overlay from 'in-new-components/overlays/Overlay';
import { Ul, Li } from 'in-new-components/lists/List';
import SvgIcon from 'in-components/SvgIcon';

import locals from './CollapsedEntitiesBreadcrumb.mless';

export default function CollapsedEntitiesBreadcrumb({ ids, light }) {
  if (ids.length === 1) {
    return (
      <PhysicalHierarchyBreadcrumb
        className={evaluateClassNames({
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
            className={evaluateClassNames({
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
  return (
    <Ul>
      {ids.map(id => (
        <Li key={id} href$={getDashboardLink(id)}>
          <PhysicalHierarchyBreadcrumb className={locals.listBreadcrumb} snapshotId={id} asLink={false} />
        </Li>
      ))}
    </Ul>
  );
}
