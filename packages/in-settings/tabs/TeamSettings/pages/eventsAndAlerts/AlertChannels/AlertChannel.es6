import { fromJS } from 'immutable';
import React from 'react';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsAlertingAlertChannels,
  teamSettingsAlertingConfigurations,
  getModifyAlertChannelUrl
} from 'in-settings/navigation/paths';

import AlertChannelTestButton from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/components/AlertChannelTestButton';
import { fullyQualified } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/configs';
import { getIntegration, saveIntegration, createIntegration } from 'in-api/integrations';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { getAlertingConfigInfos } from 'in-api/alertingConfiguration';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import { Col, Row } from 'in-new-components/layout/Grid';
import { toTitleCase } from 'in-services/util/string';
import Section from 'in-settings/components/Section';
import { goToPath } from 'in-stores/navigation';
import List from 'in-settings/components/List';
import SvgIcon from 'in-components/SvgIcon';
import entityForm from 'in-hoc/entityForm';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';

import locals from './AlertChannel.mless';

const block = 'in-alert-channel';

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
  return saveIntegration(fromJS(fullyQualified[alertChannel.get('kind')].createEntity(alertChannel, form)));
}

function createForm(config) {
  return fullyQualified[config.get('kind')].createForm(config);
}

const AlertChannelForm = entityForm(function AlertChannelForm(props) {
  const { entity, form, message, error, loading, setForm, isCreate } = props;
  const Form = fullyQualified[props.form.get('kind').value].Form;
  const entityId = entity.get('id');

  if (isCreate) {
    return (
      <SettingsDetailPage>
        <SubViewHeader>{'Create ' + entity.get('kind') + ' Alert Channel'}</SubViewHeader>

        {message ? (
          <Section>
            <Notification failure={error} loading={loading}>
              {message}
            </Notification>
          </Section>
        ) : null}

        <Form {...props} />

        <AlertChannelTestButton alertChannel={entity} form={form} setForm={setForm} />

        <SaveCancel
          form={form}
          message={message}
          loading={loading}
          isCreate={isCreate}
          listPath={teamSettingsAlertingAlertChannels}
        />
      </SettingsDetailPage>
    );
  } else {
    const parameters = fullyQualified[entity.get('kind')].getParameters();
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
                <Link href={getModifyAlertChannelUrl(entity.get('kind'), entity.get('id'))}>
                  <SvgIcon
                    className={`${block}__icon`}
                    type={'lib_actions_edit'}
                    height={20}
                    width={20}
                    color="#40535b"
                  />
                </Link>
              }
            >
              <Dl>
                {' '}
                {parameters.map(param => (
                  <Di
                    key={param.key}
                    title={param.label}
                    rowClassName={locals.row}
                    ddClassName={locals.rowInnerPadding}
                    dtClassName={locals.titleRow}
                  >
                    {entity.get(param.key)}{' '}
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
              loadEntities={() => getAlertingConfigInfos(entityId)}
              initialOrderBy="name"
              searchAttributes={['name']}
              getDetailsHref={entity => getEntityHref(teamSettingsAlertingConfigurations, entity.id)}
            />
          </Col>
        </Row>
      </SettingsDetailPage>
    );
  }
});

function getHeader() {
  return 'Events & Alerts';
}

function getEntityName(entity) {
  return entity.name;
}

const columnDefinitions = [
  {
    id: 'icon',
    label: '',
    getContent() {
      return Icon();
    }
  },
  {
    id: 'name',
    label: 'Name',
    ellipsis: '35vw',
    getContent(entity) {
      return <Link href$={getEntityIdView(teamSettingsAlertingConfigurations, entity.id)}>{entity.label}</Link>;
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
    <div className={`${block}__icon-cell`}>
      <SvgIcon className={`${block}__icon`} type={'lib_events_inverted'} height={20} width={20} color="#40535b" />
    </div>
  );
}
