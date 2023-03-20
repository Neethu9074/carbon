/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm } from 'formalistic';
import { fromJS } from 'immutable';
import React from 'react';

import { Card, Link, SvgIcon } from '@instana/components';

import {
  getEntityIdView,
  getModifyAlertChannelUrl,
  teamSettingsAlertingAlertChannels,
  teamSettingsAlertingConfigurations
} from 'in-settings/navigation/paths';
import { fullyQualified } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/configs';
import { createAlertChannel, getAlertChannel, saveAlertChannel } from 'in-api/alertChannels';
import {
  useAlertConfig as useApplicationsAlertConfig,
  useLinkToGlobalAlertConfigWithoutAPDashboard
} from 'in-applications/navigation/paths';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { getAlertsForAlertChannelId } from 'in-api/alertingConfiguration';
import { useAlertConfigLink } from 'in-websites/navigation/paths';
import { Di, Dl } from 'in-components/HorizontalDescriptionList';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import WithSubscript from 'in-settings/components/WithSubscript';
import DescriptionText from 'in-components/form/DescriptionText';
import SectionLine from 'in-settings/components/SectionLine';
import Notification from 'in-components/form/Notification';
import { toTitleCase } from 'in-services/util/string';
import { Col, Row } from 'in-components/layout/Grid';
import Section from 'in-settings/components/Section';
import { goToPath } from 'in-stores/navigation';
import List from 'in-settings/components/List';
import Tooltip from 'in-components/Tooltip';
import entityForm from 'in-hoc/entityForm';
import { role } from 'in-stores/user';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './AlertChannel.mless';

export default function AlertChannel(props) {
  const kind = getMatrixParameter(props.location, '/channels', 'kind');
  const entityId = props.match.params.id;

  return (
    <AlertChannelForm
      title={t('in-settings:tabs.alertChannel')}
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
    return <LoadingIndicator />;
  }

  if (entity && entity.get('errors')) {
    return (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={theme.lib.colors.yellow800}>
          {t('in-settings:tabs.unknownAlertChannel')}
        </SubViewHeader>
        <SectionLine />
        <DescriptionText>
          {entity.get('errors').get(0)}
          <br />
          {t('in-settings:tabs.ifYouFollowedALinkToGetHereItHasMostLikelyBeenDeleted')}
        </DescriptionText>
      </SettingsDetailPage>
    );
  }

  const parameters = getConfig(entity).getParameters();
  return (
    <SettingsDetailPage>
      <SubViewHeader>{t('in-settings:tabs.entityNameAlertChannel', { entityName: entity.get('name') })}</SubViewHeader>
      <SectionLine />

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
            title={t('in-settings:tabs.properties')}
            header={
              <Link href={getModifyAlertChannelUrl(entity.get('kind'), entityId)}>
                <SvgIcon type={'lib_actions_edit'} size="s" color="#40535b" />
              </Link>
            }
          >
            <Dl>
              {parameters
                .filter(({ key }) => key !== 'name')
                .map(({ key, label }) => (
                  <Di
                    key={key}
                    title={label}
                    rowClassName={locals.row}
                    ddClassName={locals.rowInnerPadding}
                    dtClassName={locals.titleRow}
                  >
                    {getPropertyValue(entity, key)}
                  </Di>
                ))}
            </Dl>
          </Card>
        </Col>
        <Col lg={7}>
          {role.canConfigureCustomAlerts && (
            <List
              cardTitle={t('in-settings:tabs.alerts')}
              getHeader={getHeader}
              tableInCard
              getEntityName={getEntityName}
              columnDefinitions={columnDefinitions}
              loadEntities={() => getAlertsForAlertChannelId(entityId)}
              initialOrderBy="label"
              searchAttributes={['label']}
            />
          )}
        </Col>
      </Row>
    </SettingsDetailPage>
  );
});

function getHeader() {
  return t('in-settings:tabs.eventsAlerts');
}

function getEntityName(entity) {
  return entity.label;
}

function getPropertyValue(entity, key) {
  if (key === 'kind') {
    return getConfig(entity).label;
  }

  if (key === 'password') {
    return Array(entity.get(key)?.length ?? 0).join('*');
  }

  if (entity.get(key) && entity.get(key).join) {
    return entity.get(key).join(', ');
  }

  return entity.get(key)?.toString();
}

const typeLabels = Object.freeze({
  ApplicationSmartAlert: t('in-settings:tabs.applicationSmartAlert'),
  WebsiteSmartAlert: t('in-settings:tabs.websiteSmartAlert'),
  GlobalApplicationSmartAlert: t('in-settings:tabs.globalApplicationSmartAlert')
});

function AlertChannelLabel({ entity }) {
  const { entityId, label, type, id } = entity;
  const getApplicationsAlertConfig = useApplicationsAlertConfig();
  const getLinkToGlobalAlertConfigWithoutAPDashboard = useLinkToGlobalAlertConfigWithoutAPDashboard();
  const websiteAlertConfigLink = useAlertConfigLink(id, entityId);

  let href;
  let href$;
  if (type === 'WebsiteSmartAlert') {
    href = websiteAlertConfigLink;
  } else if (type === 'ApplicationSmartAlert') {
    href = getApplicationsAlertConfig(id, entityId);
  } else if (type === 'GlobalApplicationSmartAlert') {
    href = getLinkToGlobalAlertConfigWithoutAPDashboard(id);
  } else {
    href$ = getEntityIdView(teamSettingsAlertingConfigurations, id);
  }

  return (
    <Tooltip content={label} align="topLeft" delay={500}>
      <WithSubscript subscript={getSubscript(entity)}>
        <Link href$={href$} href={href} ellipsis>
          {label}
        </Link>
      </WithSubscript>
    </Tooltip>
  );
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
    label: t('in-settings:tabs.name'),
    width: 50,
    getContent: entity => <AlertChannelLabel entity={entity} />
  },
  {
    id: 'kind',
    label: t('in-settings:tabs.type'),
    getValue({ type }) {
      return typeLabels[type] ?? type;
    },
    getContent({ type }) {
      return typeLabels[type] ?? type;
    }
  },
  {
    id: 'enabled',
    label: t('in-settings:tabs.status'),
    width: 20,
    ellipsis: true,
    getContent({ enabled }) {
      if (enabled) {
        return toTitleCase(t('in-settings:tabs.enabled'));
      }
      return toTitleCase(t('in-settings:tabs.disabled'));
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

function getSubscript({ invalid }) {
  return (
    invalid && (
      <span key="invalid" className={locals.invalid}>
        {t('in-settings:tabs.invalidQuery')}
      </span>
    )
  );
}

function getConfig(entity) {
  return fullyQualified[entity.get('kind')];
}
