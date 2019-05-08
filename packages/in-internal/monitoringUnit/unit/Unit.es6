import { Route } from 'react-router-dom';
import React from 'react';

import ApplicationDataStatistics from 'in-internal/monitoringUnit/unit/ApplicationDataStatistics';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { LinkList, LinkListItem } from 'in-internal/components/LinkList/LinkList';
import EntityStatistics from 'in-internal/monitoringUnit/unit/EntityStatistics';
import UnitsBreadcrumb from 'in-internal/monitoringUnit/units/UnitsBreadcrumb';
import InternalViewWrapper from 'in-internal/components/InternalViewWrapper';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import Switch from 'in-components/FragmentSupportingSwitch';
import { getModifiedUrlStream } from 'in-stores/navigation';

import locals from './Unit.mless';

export default function Unit(props) {
  const tenant = getMatrixParameter(props.location, '/unit', 'tenant');
  const unit = getMatrixParameter(props.location, '/unit', 'unit');

  return (
    <InternalViewWrapper>
      <Breadcrumbs
        items={[
          <UnitsBreadcrumb />,
          <Breadcrumb
            href$={getModifiedUrlStream(params => {
              params.pathname = '/internal/monitoringUnit/unit';
              setOrDeleteMatrixKey(params, '/unit', 'tenant', tenant);
              setOrDeleteMatrixKey(params, '/unit', 'unit', unit);
            })}
            label="Tenant Unit"
          >
            {tenant}-{unit}
          </Breadcrumb>
        ]}
      />

      <div className={locals.wrapper}>
        <div className={locals.left}>
          <Navigation tenant={tenant} unit={unit} />
        </div>
        <div className={locals.right}>
          <Switch>
            <Route
              path="/internal/monitoringUnit/unit/entityStatistics"
              render={() => <EntityStatistics tenant={tenant} unit={unit} />}
            />
            <Route
              path="/internal/monitoringUnit/unit/applicationDataStatistics"
              render={() => <ApplicationDataStatistics tenant={tenant} unit={unit} />}
            />
          </Switch>
        </div>
      </div>
    </InternalViewWrapper>
  );
}

function Navigation() {
  return (
    <LinkList>
      <LinkListItem
        label="Entity Statistics"
        href$={getModifiedUrlStream(p => (p.pathname = '/internal/monitoringUnit/unit/entityStatistics'))}
      />
      <LinkListItem
        label="Application Data Statistics"
        href$={getModifiedUrlStream(p => (p.pathname = '/internal/monitoringUnit/unit/applicationDataStatistics'))}
      />
    </LinkList>
  );
}
