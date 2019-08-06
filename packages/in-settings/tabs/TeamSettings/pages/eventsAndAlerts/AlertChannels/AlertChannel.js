import { createMapForm } from 'formalistic';
import React from 'react';
import { fromJS } from 'immutable';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsAlertingAlertChannels,
  teamSettingsAlertingConfigurations,
  getModifyAlertChannelUrl
} from 'in-settings/navigation/paths';

import { fullyQualified } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/configs';
import { getAlertChannel, saveAlertChannel, createAlertChannel } from 'in-api/alertChannels';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { getAlertsForAlertChannelId } from 'in-api/alertingConfiguration';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import WithSubscript from 'in-settings/components/WithSubscript';
import DescriptionText from 'in-components/form/DescriptionText';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Notification from 'in-components/form/Notification';
import { Col, Row } from 'in-new-components/layout/Grid';
import { toTitleCase } from 'in-services/util/string';
import Section from 'in-settings/components/Section';
import { goToPath } from 'in-stores/navigation';
import List from 'in-settings/components/List';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import entityForm from 'in-hoc/entityForm';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';
import { role } from 'in-stores/user';
import theme from 'in-themes';

import locals from './AlertChannel.mless';

export default function AlertChannel(props) {
  const kind = getMatrixParameter(props.location, '/channels', 'kind');
  const entityId = props.match.params.id;

  return (
    <AlertChannelForm
      title="Alert Channel"
      entityId={entityId}
      createDefaultEntity={() => createAlertChannel(null, kind)}
      createForm={createForm}
      getEntityFromApi={getAlertChannel}
      openEntities={() => goToPath(teamSettingsAlertingAlertChannels)}
      saveEntity={save}
    />
  );
}

function save(alertChannel, form) {
  return saveAlertChannel(fromJS(getConfig(alertChannel).createEntity(alertChannel, form)));
}

function createForm(alertChannel) {
  if (!alertChannel || alertChannel.get('errors')) {
    return createMapForm();
  }

  return getConfig(alertChannel).createForm(alertChannel);
}

const AlertChannelForm = entityForm(function AlertChannelForm(props) {
  const { entity, form, entityId, message, error, loading } = props;

  if (!entity || !form) {
    return <LoadingIndicator type="dark" />;
  }

  if (entity && entity.get('errors')) {
    return (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={theme.lib.colors.yellow800}>
          Unknown Alert Channel
        </SubViewHeader>
        <DescriptionText>
          {entity.get('errors').get(0)}
          <br />
          If you followed a link to get here, it has most likely been deleted.
        </DescriptionText>
      </SettingsDetailPage>
    );
  }

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
                <SvgIcon type={'lib_actions_edit'} size="s" color="#40535b" />
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
                  {key === 'kind'
                    ? getConfig(entity).label
                    : entity.get(key).join
                      ? entity.get(key).join(', ')
                      : entity.get(key)}
                </Di>
              ))}
            </Dl>
          </Card>
        </Col>
        <Col lg={7}>
          {role.canConfigureCustomAlerts && (
            <List
              cardTitle="Alerts"
              getHeader={getHeader}
              tableInCard
              getEntityName={getEntityName}
              columnDefinitions={columnDefinitions}
              loadEntities={() => getAlertsForAlertChannelId(entityId)}
              initialOrderBy="label"
              searchAttributes={['label']}
              getDetailsHref={entity => getEntityHref(teamSettingsAlertingConfigurations, entity.id)}
            />
          )}
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
    sortable: false,
    width: '2rem',
    widthInAbsoluteUnit: true,
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
    width: 50,
    getContent(entity) {
      return (
        <Tooltip content={entity.label} align="topLeft" delay={500}>
          <WithSubscript subscript={getSubscript(entity)}>
            <Link href$={getEntityIdView(teamSettingsAlertingConfigurations, entity.id)} ellipsis>
              {entity.label}
            </Link>
          </WithSubscript>
        </Tooltip>
      );
    }
  },
  {
    id: 'kind',
    label: 'Type',
    ellipsis: true,
    getContent() {
      return 'Alert';
    }
  },
  {
    id: 'enabled',
    label: 'Status',
    ellipsis: true,
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
      <SvgIcon type={'lib_events_inverted'} size="s" color="#40535b" />
    </div>
  );
}

function getSubscript(entity) {
  return (
    entity.invalid && (
      <span key="invalid" className={locals.invalid}>
        Invalid Query
      </span>
    )
  );
}

function getConfig(entity) {
  return fullyQualified[entity.get('kind')];
}
