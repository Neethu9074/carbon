/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm } from 'formalistic';
import { Map, fromJS } from 'immutable';
import React, { Fragment } from 'react';

import { Card, Link, SvgIcon } from '@instana/components';
import { themes } from '@instana/design-tokens';

import {
  getEntityIdView,
  getModifyAlertChannelUrl,
  globalSettingsAlertingAlertChannels,
  teamSettingsAlertingAlerts
} from 'in-settings/navigation/paths';
import {
  useAlertConfig as useApplicationsAlertConfig,
  useLinkToGlobalAlertConfigWithoutAPDashboard
} from 'in-applications/navigation/paths';
import { useGetAlertConfigLink as useGetServiceLevelAlertConfigLink } from 'in-service-levels/navigation/path';
import { fullyQualified } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/configs';
import { useGetAlertConfigLink as useGetInfraAlertConfigLink } from 'in-infrastructure/navigation/paths';
import { alertChannelCTATrackerSegment, editAlertChannelTracker } from 'in-settings/tracker';
import { createAlertChannel, getAlertChannel, saveAlertChannel } from 'in-api/alertChannels';
import { useLinkToGlobalAlertConfigWithoutDashboard } from 'in-synthetics/navigation/paths';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { SETTINGS_ALERT_CHANNEL_EDIT } from 'in-services/tracking/eventNames';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { getAlertsForAlertChannelId } from 'in-api/alertingConfiguration';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useGetAlertConfigLink } from 'in-mobile-apps/navigation/paths';
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
import List from 'in-settings/components/List';
import Tooltip from 'in-components/Tooltip';
import entityForm from 'in-hoc/entityForm';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './AlertChannel.mless';

export default function AlertChannel(props) {
  const kind = getMatrixParameter(props.location, '/channels', 'kind');
  const entityId = props.match.params.id;
  const { goToPath } = useNavigation();

  return (
    <AlertChannelForm
      title={t('in-settings:tabs.alertChannel')}
      entityId={entityId}
      createDefaultEntity={() => createAlertChannel(null, kind)}
      createForm={createForm}
      getEntityFromApi={getAlertChannel}
      openEntities={() => goToPath(globalSettingsAlertingAlertChannels)}
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

/**
 * Role based filtering should ideally happen in backend API /api/events/settings/alert-configs/infos
 * But for now I'm placing this logic in UI as RBAC is not applied in above API yet.
 *
 * TODO: Move this filtering logic to backend based on permissions.
 */
function filterAlertConfigBasedOnRoles(alertConfigResponse) {
  const canConfigureEventsAndAlerts = role.canConfigureEventsAndAlerts;
  const canConfigureApplicationSmartAlerts = role.canConfigureApplicationSmartAlerts;
  const canConfigureWebsiteSmartAlerts = role.canConfigureWebsiteSmartAlerts;
  const canConfigureMobileAppSmartAlerts = role.canConfigureMobileAppSmartAlerts;
  const canConfigureGlobalApplicationSmartAlerts = role.canConfigureGlobalApplicationSmartAlerts;
  const canConfigureGlobalSyntheticSmartAlerts = role.canConfigureGlobalSyntheticSmartAlerts;
  const canConfigureGlobalInfraSmartAlerts =
    role.canConfigureGlobalInfraSmartAlerts && !role?.limitedInfrastructureScope;
  const canConfigureServiceLevelIndicators = role.canConfigureServiceLevelIndicators;

  return alertConfigResponse.filter(item => {
    const type = item.type;

    if (type === 'WebsiteSmartAlert') {
      return canConfigureWebsiteSmartAlerts;
    } else if (type === 'MobileSmartAlert') {
      return canConfigureMobileAppSmartAlerts;
    } else if (type === 'ApplicationSmartAlert') {
      return canConfigureApplicationSmartAlerts;
    } else if (type === 'GlobalApplicationSmartAlert') {
      return canConfigureGlobalApplicationSmartAlerts;
    } else if (type === 'SyntheticSmartAlert') {
      return canConfigureGlobalSyntheticSmartAlerts;
    } else if (type === 'InfraSmartAlert') {
      return canConfigureGlobalInfraSmartAlerts;
    } else if (type === 'Alert') {
      return canConfigureEventsAndAlerts;
    } else if (type == 'ServiceLevelSmartAlert') {
      return canConfigureServiceLevelIndicators;
    }

    return false;
  });
}

const AlertChannelForm = entityForm(function AlertChannelForm(props) {
  const { entity, form, entityId, message, error, loading } = props;
  const { location } = useNavigation();
  if (!entity || !form) {
    return <LoadingIndicator />;
  }

  if (entity && entity.get('errors')) {
    return (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={themes.default.ids.color.option.yellow['500']}>
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
              <Link
                onClick={() => {
                  editAlertChannelTracker({
                    alertChannelType: entity.get('kind') ?? '',
                    alertChannelId: entity.get('id') ?? '',
                    alertChannelName: entity.get('name') ?? ''
                  });
                  alertChannelCTATrackerSegment({
                    EVENT_NAME: SETTINGS_ALERT_CHANNEL_EDIT,
                    path: location.pathname,
                    channel: entity.get('kind') ?? ''
                  });
                }}
                href={getModifyAlertChannelUrl(entity.get('kind'), entityId)}
              >
                <SvgIcon type={'lib_actions_edit'} size="s" color="#40535b" />
              </Link>
            }
          >
            <Dl>
              {parameters
                .filter(({ key }) => key !== 'name')
                .map(({ key, label, isNested = false, nestedParamKeys = [] }) =>
                  !isNested ? (
                    <Di
                      key={key}
                      title={label}
                      rowClassName={locals.row}
                      ddClassName={locals.rowInnerPadding}
                      dtClassName={locals.titleRow}
                    >
                      {getPropertyValue(entity, key)}
                    </Di>
                  ) : (
                    nestedParamsHaveAtLeastOneValue(entity, key, nestedParamKeys) && (
                      <Fragment>
                        <Di
                          key={key}
                          title={label}
                          rowClassName={locals.row}
                          ddClassName={locals.rowInnerPadding}
                          dtClassName={locals.titleRow}
                        >
                          {'---OPEN VALUE, CLOSE VALUE---'}
                        </Di>
                        {nestedParamKeys.map(
                          param =>
                            nestedParamsHaveAtLeastOneValue(entity, key, [param]) && (
                              <Di
                                key={param.key}
                                title={param.label}
                                rowClassName={locals.row}
                                ddClassName={locals.rowInnerPadding}
                                dtClassName={locals.titleRow}
                              >
                                {getPropertyValue(entity.get(key), param.key)}
                              </Di>
                            )
                        )}
                      </Fragment>
                    )
                  )
                )}
            </Dl>
          </Card>
        </Col>
        <Col lg={7}>
          <List
            cardTitle={t('in-settings:tabs.alerts')}
            getHeader={getHeader}
            tableInCard
            getEntityName={getEntityName}
            columnDefinitions={columnDefinitions}
            loadEntities={() => getAlertsForAlertChannelId(entityId).map(resp => filterAlertConfigBasedOnRoles(resp))}
            initialOrderBy="label"
            searchAttributes={['label']}
          />
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

function nestedParamsHaveAtLeastOneValue(entity, key, nestedKeys) {
  if (nestedKeys.length === 0 || !entity.get(key) || entity.get(key)?.size === 0) return false;

  const nestedMap = entity.get(key);

  let hasVal = false;

  nestedKeys.forEach(nestedKey => {
    if (
      nestedKey &&
      nestedKey.key &&
      Map.isMap(nestedMap) &&
      nestedMap.has(nestedKey.key) &&
      nestedMap.get(nestedKey.key)
    ) {
      const testText = nestedMap.get(nestedKey.key).join('');
      if (testText !== '') hasVal = true;
    }
  });

  return hasVal;
}

function getPropertyValue(entity, key) {
  if (key === 'kind') {
    return getConfig(entity).label;
  }

  if (key === 'password' || key === 'bearerAuthToken') {
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
  MobileSmartAlert: t('in-settings:tabs.mobileSmartAlert'),
  GlobalApplicationSmartAlert: t('in-settings:tabs.globalApplicationSmartAlert'),
  SyntheticSmartAlert: t('in-settings:tabs.syntheticSmartAlert'),
  InfraSmartAlert: t('in-settings:tabs.infraSmartAlert'),
  ServiceLevelSmartAlert: t('in-settings:tabs.serviceLevelSmartAlert')
});

function AlertChannelLabel({ entity }) {
  const { entityId, label, type, id } = entity;
  const getApplicationsAlertConfig = useApplicationsAlertConfig();
  const getLinkToGlobalAlertConfigWithoutAPDashboard = useLinkToGlobalAlertConfigWithoutAPDashboard();
  const getLinkToSyntheticAlertConfigWithoutAPDashboard = useLinkToGlobalAlertConfigWithoutDashboard();
  const getInfraAlertConfigLink = useGetInfraAlertConfigLink();
  const websiteAlertConfigLink = useAlertConfigLink(id, entityId);
  const mobileAlertConfigLink = useGetAlertConfigLink();
  const getServiceLevelAlertConfigLink = useGetServiceLevelAlertConfigLink();

  let href;
  let href$;
  if (type === 'WebsiteSmartAlert') {
    href = websiteAlertConfigLink;
  } else if (type === 'MobileSmartAlert') {
    href = mobileAlertConfigLink(id, entityId);
  } else if (type === 'ApplicationSmartAlert') {
    href = getApplicationsAlertConfig(id, entityId);
  } else if (type === 'GlobalApplicationSmartAlert') {
    href = getLinkToGlobalAlertConfigWithoutAPDashboard(id);
  } else if (type === 'SyntheticSmartAlert') {
    href = getLinkToSyntheticAlertConfigWithoutAPDashboard(id);
  } else if (type === 'InfraSmartAlert') {
    href = getInfraAlertConfigLink(id, entity.created);
  } else if (type === 'ServiceLevelSmartAlert') {
    href = getServiceLevelAlertConfigLink(id, entity.created);
  } else {
    href$ = getEntityIdView(teamSettingsAlertingAlerts, id);
  }

  return (
    <Tooltip content={label} align="topLeft" delay={500}>
      <WithSubscript subscript={getSubscript(entity)}>
        <Link href={href$ ?? href} ellipsis>
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
