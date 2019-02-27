import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsAlertingAlertChannels,
  teamSettingsAlertingConfigurations,
  getModifyAlertChannelUrl
} from 'in-settings/navigation/paths';

import { fullyQualified } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/configs';
import { getIntegration, saveIntegration, createIntegration } from 'in-api/integrations';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { getAlertsForAlertChannelIds } from 'in-api/alertingConfiguration';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import WithSubscript from 'in-settings/components/WithSubscript';
import Notification from 'in-components/form/Notification';
import { Col, Row } from 'in-new-components/layout/Grid';
import { toTitleCase } from 'in-services/util/string';
import { intersperse } from 'in-services/arrayUtils';
import Section from 'in-settings/components/Section';
import { goToPath } from 'in-stores/navigation';
import List from 'in-settings/components/List';
import SvgIcon from 'in-components/SvgIcon';
import entityForm from 'in-hoc/entityForm';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';

import locals from './AlertChannel.mless';

export default function AlertChannel(props) {
  const kind = getMatrixParameter(props.location, '/channels', 'kind');
  const entityId = props.match.params.id;

  return (
    <AlertChannelForm
      title="Alert Channel"
      entityId={entityId}
      createDefaultEntity={() => createIntegration(null, kind)}
      createForm={createForm}
      getEntityFromApi={getIntegration}
      openEntities={() => goToPath(teamSettingsAlertingAlertChannels)}
      saveEntity={save}
    />
  );
}

function save(alertChannel, form) {
  return saveIntegration(fromJS(getConfig(alertChannel).createEntity(alertChannel, form)));
}

function createForm(alertChannel) {
  return getConfig(alertChannel).createForm(alertChannel);
}

const AlertChannelForm = entityForm(function AlertChannelForm(props) {
  const { entity, entityId, message, error, loading } = props;
  const parameters = getConfig(entity).getParameters();
  return (
    <SettingsDetailPage>
      <SubViewHeader>{entity.get('name') + ' Alert Channel'}</SubViewHeader>

      {message ? (
        <Section>
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        </Section>
      ) : null}
      <Row>
        <Col lg={5}>
          <Card
            title="Properties"
            header={
              <Link href={getModifyAlertChannelUrl(entity.get('kind'), entityId)}>
                <SvgIcon type={'lib_actions_edit'} height={20} width={20} color="#40535b" />
              </Link>
            }
          >
            <Dl>
              {parameters.filter(({ key }) => key !== 'name').map(({ key, label }) => (
                <Di
                  key={key}
                  title={label}
                  rowClassName={locals.row}
                  ddClassName={locals.rowInnerPadding}
                  dtClassName={locals.titleRow}
                >
                  {key === 'kind' ? getConfig(entity).label : entity.get(key)}
                </Di>
              ))}
            </Dl>
          </Card>
        </Col>
        <Col lg={7}>
          <List
            title="Events & Alerts"
            cardTitle="Events & Alerts"
            getHeader={getHeader}
            tableInCard
            getEntityName={getEntityName}
            columnDefinitions={columnDefinitions}
            loadEntities={() => getAlertsForAlertChannelIds([entityId])}
            initialOrderBy="label"
            searchAttributes={['label']}
            getDetailsHref={entity => getEntityHref(teamSettingsAlertingConfigurations, entity.id)}
          />
        </Col>
      </Row>
    </SettingsDetailPage>
  );
});

function getHeader() {
  return 'Events & Alerts';
}

function getEntityName(entity) {
  return entity.label;
}

const columnDefinitions = [
  {
    id: 'icon',
    label: '',
    sortable: false,
    getContent() {
      return Icon();
    },
    getValue() {
      return null;
    }
  },
  {
    id: 'label',
    label: 'Name',
    getContent(entity) {
      return (
        <WithSubscript subscript={getSubscript(entity)}>
          <Link href$={getEntityIdView(teamSettingsAlertingConfigurations, entity.id)} className={locals.ellipsis10vw}>
            {entity.label}
          </Link>
        </WithSubscript>
      );
    }
  },
  {
    id: 'kind',
    label: 'Type',
    getContent() {
      return 'Alert';
    }
  },
  {
    id: 'enabled',
    label: 'Status',
    getContent(entity) {
      if (entity.enabled) {
        return toTitleCase('Enabled');
      }
      return toTitleCase('Disabled');
    }
  }
];

function Icon() {
  return (
    <div>
      <SvgIcon type={'lib_events_inverted'} height={20} width={20} color="#40535b" />
    </div>
  );
}

function getSubscript(/* entity */) {
  return (
    <Fragment>
      {intersperse(
        [
          // TODO Waiting for back end to provide invalid/deprecated flag
          // !isEnabled(entity) ? <span key="disabled">Disabled</span> : null,
          // !entity.valid ? (
          //   <span key="invalid" className={locals.invalidOrDeprecated}>
          //     Invalid Query
          //   </span>
          // ) : null
        ].filter(elem => elem),
        <span>, </span>
      )}
    </Fragment>
  );
}

function getConfig(entity) {
  return fullyQualified[entity.get('kind')];
}
