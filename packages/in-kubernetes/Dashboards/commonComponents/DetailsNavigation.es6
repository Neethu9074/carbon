import { Route, Switch } from 'react-router-dom';
import React from 'react';

import { SideNavigation, SideNavigationItem } from 'in-new-components/SideNavigation/SideNavigation';
import KeyValueList from 'in-kubernetes/Dashboards/commonComponents/KeyValueList';
import Annotations from 'in-kubernetes/Dashboards/commonComponents/Annotations';
import { getModifiedUrlStream, isView } from 'in-stores/navigation';
import Spec from 'in-kubernetes/Dashboards/commonComponents/Spec';
import { Row, Col } from 'in-new-components/layout/Grid';
import connectTo from 'in-hoc/connectTo';

export default function Details({ navigationItems, resource, ...props }) {
  return (
    <Row>
      <Col lg={3}>
        <SideNav navigationItems={navigationItems} resource={resource} {...props} />
      </Col>
      <Col lg={9}>
        <ContentPane navigationItems={navigationItems} resource={resource} {...props} />
      </Col>
    </Row>
  );
}

function SideNav({ navigationItems, ...props }) {
  return (
    <SideNavigation>
      {navigationItems.map(item => (
        <BoundSideNavigation
          href$={getModifiedUrlStream(params => {
            params.pathname = item.path;
          })}
          key={item.path}
          icon={item.icon}
          label={item.label ? item.label : item.renderLabel(props)}
          path={item.path}
        />
      ))}
    </SideNavigation>
  );
}

const BoundSideNavigation = connectTo(
  ({ path }) => ({ isActive: isView(pathname => pathname === path) }),
  SideNavigationItem
);

function ContentPane({ navigationItems, ...props }) {
  return (
    <Switch>
      {navigationItems.map(item => (
        <Route key={item.path} exact path={item.path} render={() => <item.component {...props} />} />
      ))}
    </Switch>
  );
}

export function labelsNavigationItem(path) {
  return {
    path,
    icon: 'lib_kubernetes_label',
    renderLabel: ({ resource }) => `Labels (${resource.labels.length})`,
    component: ({ resource }) => (
      <KeyValueList title="Labels" icon="lib_kubernetes_label" items={resource.labels} onEmptyText="No Labels" />
    )
  };
}

export function annotationsNavigationItem(path) {
  return {
    path,
    renderLabel: ({ annotations }) => `Annotations (${annotations ? annotations.length : 0})`,
    component: ({ annotations }) => <Annotations annotations={annotations} onEmptyText="No Annotations" />
  };
}

export function specNavigationItem(path) {
  return {
    path,
    label: 'Spec',
    component: ({ resource }) => <Spec snapshotId={resource.id} />
  };
}
