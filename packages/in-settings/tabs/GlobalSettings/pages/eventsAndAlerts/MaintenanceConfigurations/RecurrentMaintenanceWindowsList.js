/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import { startCase } from 'lodash';

import { Link, Stack, Typography, Button, ButtonGroup, Pill } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import {
  SETTINGS_MAINTENANCE_WINDOW_EDIT,
  SETTINGS_MAINTENANCE_WINDOW_NEW,
  SETTINGS_MAINTENANCE_WINDOW_PAUSE,
  SETTINGS_MAINTENANCE_WINDOW_REMOVE,
  SETTINGS_MAINTENANCE_WINDOW_RESUME,
  SETTINGS_MAINTENANCE_WINDOW_ACTIVE_TAB,
  SETTINGS_MAINTENANCE_WINDOW_SCHEDULED_TAB,
  SETTINGS_MAINTENANCE_WINDOW_EXPIRED_TAB
} from 'in-services/tracking/eventNames';
import {
  pauseMaintenanceConfig,
  resumeMaintenanceConfig,
  getMaintenanceConfigsMutableV2,
  deleteMaintenanceConfigV2
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/api.ts';
import RecurrentMaintenanceConfigForm from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/RecurrentMaintenanceConfigForm';
import FeedbackDialog from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/feedback/FeedbackDialog';
import { getEndAndTimeDurationOfWindow } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/rruleHelpers';
import { maintenanceWindowCTATracker } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/tracker';
import {
  getEntityIdView,
  globalSettingsAlertingMaintenanceConfigurations,
  getEntityHref
} from 'in-settings/navigation/paths';
import { getQueryBuilder } from 'in-alerting/smart-alerts/synthetics/components/AlertQueryBuilder';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import useSettingsEditor from 'in-settings/tabs/UserSettings/pages/useSettingsEditor';
import { recurrentMaintenanceWindowsTabsEnabled } from 'in-services/featureFlags';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { indeterminateProgress } from 'in-services/fixedObjects';
import { formatDateTime } from 'in-services/formatters/date';
import List from 'in-settings/components/List';
import WithIcon from 'in-components/WithIcon';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

export default function RecurrentMaintenanceWindowsList(props) {
  const getStartAsString = entity => getFormattedDateTimeOccurence(entity, 'start');
  const getEndAsString = entity => getFormattedDateTimeOccurence(entity, 'end');
  const [saved, setSaved] = useState(false);
  const allMaintenanceConfigs = useObservable(getMaintenanceConfigsMutableV2, [saved]) ?? indeterminateProgress;

  const [mwTypeView, setMwTypeView] = useState('ACTIVE');
  const [numbers, setNumbers] = useState({ active: 0, scheduled: 0, expired: 0 });
  const [settings, saveSetting] = useSettingsEditor();
  const { location } = useNavigation();

  useEffect(() => {
    let initialNumState = { active: 0, scheduled: 0, expired: 0 };
    if (!allMaintenanceConfigs.loading) {
      allMaintenanceConfigs.forEach(mw => {
        if (mw.state === 'ACTIVE') initialNumState = { ...initialNumState, active: initialNumState.active + 1 };
        if (mw.state === 'SCHEDULED')
          initialNumState = { ...initialNumState, scheduled: initialNumState.scheduled + 1 };
        if (mw.state === 'FINISHED' || mw.state === 'UNSCHEDULED')
          initialNumState = { ...initialNumState, expired: initialNumState.expired + 1 };
      });
      setNumbers(initialNumState);
    }
  }, [allMaintenanceConfigs, saved]);

  // For when creating new MW config to refresh table
  useEffect(() => {
    if (!saved) return;
    if (settings && !settings['hasConfiguredRMW']) {
      addActiveDialog(<FeedbackDialog firstTime />);
      saveSetting('hasConfiguredRMW', true);
      setSaved(false);
    } else {
      setSaved(false);
    }
  }, [saved, settings, saveSetting]);

  const tableActions = {
    delete: {
      deleteEntity: entity => {
        // Sending type of maintenance window deleted
        maintenanceWindowCTATracker(SETTINGS_MAINTENANCE_WINDOW_REMOVE, location.pathname, entity.scheduling.type);
        setSaved(true);
        return deleteMaintenanceConfigV2(entity.id);
      }
    },
    toggleEnabled: {
      get: entity => !entity.paused,
      toggle: entity => {
        const entityEventObject = {
          mwID: entity.id,
          name: entity.name || null,
          type: entity.scheduling.type,
          currentState: entity.state
        };
        if (entity.paused) {
          maintenanceWindowCTATracker(
            SETTINGS_MAINTENANCE_WINDOW_RESUME,
            location.pathname,
            undefined,
            entityEventObject
          );
          return resumeMaintenanceConfig(entity.id);
        } else {
          maintenanceWindowCTATracker(
            SETTINGS_MAINTENANCE_WINDOW_PAUSE,
            location.pathname,
            undefined,
            entityEventObject
          );
          return pauseMaintenanceConfig(entity.id);
        }
      },
      disabled: entity => entity.state !== 'ACTIVE' && entity.state !== 'SCHEDULED' && entity.state !== 'PAUSED',
      disableLabel: t('in-alerting:components.revisionDropdownButton.pause'),
      enableLabel: t('in-alerting:components.revisionDropdownButton.resume')
    }
  };

  return (
    <div>
      {recurrentMaintenanceWindowsTabsEnabled && (
        <Typography variant="heading-300" component="span">
          {t('in-settings:tabs.maintenanceWindowConfigurations')}
        </Typography>
      )}

      <List
        title={t('in-settings:tabs.maintenanceWindowConfigurations')}
        getCustomHeader={(totalHitsBeforeFilter, totalHitsAfterFilter) => {
          if (recurrentMaintenanceWindowsTabsEnabled) {
            return <DisplayMWTypes mwTypeView={mwTypeView} setMwTypeView={setMwTypeView} numbers={numbers} />;
          }

          const title = t('in-settings:tabs.maintenanceWindowConfigurations');
          let titleWithHits = title;

          if (totalHitsBeforeFilter !== 0) {
            if (totalHitsBeforeFilter === totalHitsAfterFilter) {
              titleWithHits = title + `(${totalHitsAfterFilter})`;
            } else {
              titleWithHits = title + `(${totalHitsAfterFilter}/${totalHitsBeforeFilter})`;
            }
          }

          return (
            <Stack gap="xxsmall">
              <Typography variant="heading-300">{titleWithHits}</Typography>
              <Button
                onClick={() => addActiveDialog(<FeedbackDialog />)}
                icon="lib_views_external_link"
                iconSize="s"
                kind="subtle"
                size="compact"
              >
                {t('in-settings:tabs.shareFeedback')}
              </Button>
            </Stack>
          );
        }}
        isBeta
        getEntityName={getEntityName}
        columnDefinitions={columnDefinitions}
        tableActions={tableActions}
        loadEntities={getMaintenanceConfigsMutableV2}
        initialOrderBy="name"
        labelNew={t('in-settings:tabs.scheduleMaintenanceWindow')}
        onCreateNew={() => {
          addActiveDialog(<RecurrentMaintenanceConfigForm {...props} onClose={close} setSaved={setSaved} />);
        }}
        getDetailsHref={entity => {
          maintenanceWindowCTATracker(SETTINGS_MAINTENANCE_WINDOW_EDIT, location.pathname);
          return getEntityHref(globalSettingsAlertingMaintenanceConfigurations, entity.id);
        }}
        trackEvent={() => maintenanceWindowCTATracker(SETTINGS_MAINTENANCE_WINDOW_NEW, location.pathname)}
        searchAttributes={['name', 'query', getStartAsString, getEndAsString, 'state']}
        extraFilters={recurrentMaintenanceWindowsTabsEnabled ? [element => filteringMWList(element, mwTypeView)] : []}
      />
    </div>
  );
}

const filteringMWList = (element, mwTypeView) => {
  if (mwTypeView !== 'EXPIRED') return element.state === mwTypeView;

  return element.state === 'FINISHED' || element.state === 'UNSCHEDULED';
};

export function RecurrentMaintenanceWindowStatusCell({ state, paused }) {
  {
    let mwStatusLabel = state;
    if ((mwStatusLabel === 'ACTIVE' || mwStatusLabel === 'SCHEDULED') && paused) {
      mwStatusLabel = 'PAUSED';
    }

    const pillType = () => {
      switch (mwStatusLabel) {
        case 'ACTIVE':
          return 'green';
        case 'FINISHED':
        case 'EXPIRED':
          return 'gray';
        case 'PAUSED':
          return 'yellow';
        case 'SCHEDULED':
          return 'blue';
        case 'UNSCHEDULED':
          return 'purple';
      }
      return 'gray';
    };
    const mwStatusLabelText = t('in-settings:maintenanceWindow.status', {
      context: mwStatusLabel.toLowerCase?.()
    });

    return <Pill type={pillType()}>{mwStatusLabelText}</Pill>;
  }
}

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-settings:tabs.name'),
    getContent: function Content(entity) {
      const { createHrefToPath } = useNavigation();

      return (
        <Tooltip content={entity.name} align="topLeft" delay={500} overwriteBlock caret={false}>
          <Link href={getEntityIdView(globalSettingsAlertingMaintenanceConfigurations, entity.id, createHrefToPath)}>
            <WithIcon icon="lib_actions_build_outline" iconColor={themes.default.ids.color.option.blue['500']} ellipsis>
              {entity.name}
            </WithIcon>
          </Link>
        </Tooltip>
      );
    }
  },
  {
    id: 'scope',
    label: t('in-settings:tabs.scope'),
    ellipsis: true,
    getValue(entity) {
      let txt = '';
      const entityAppNames = entity?.applicationNames || [];
      if (entityAppNames.length > 0) {
        txt = t('in-settings:maintenanceWindow.appQuery', { numApps: entityAppNames.length });
      } else if (entity?.query) {
        txt = `${t('in-settings:maintenanceWindow.dfqColumn')}` + entity?.query;
      } else if (entity?.tagFilterExpressionEnabled) {
        txt = t('in-settings:tabs.syntheticTests');
      } else if (!entityAppNames.length === 0 && !entity.query) {
        txt = t('in-settings:maintenanceWindow.allEntitiesColumn');
      }
      return txt;
    },
    getContent(entity) {
      let text = '',
        tooltipContent = '';

      const entityAppNames = entity?.applicationNames || [];
      if (entityAppNames.length > 0) {
        text = t('in-settings:maintenanceWindow.appQuery', { numApps: entityAppNames.length });
        entityAppNames.forEach((app, idx) => {
          if (idx < 5) tooltipContent = tooltipContent + app;
          if (idx === 5) tooltipContent = tooltipContent + '...';

          if (idx !== entityAppNames.length - 1) tooltipContent += ', ';
        });
      } else if (entity.query) {
        text = t('in-settings:maintenanceWindow.dfqColumn');
        tooltipContent = entity.query;
      } else if (entity.tagFilterExpressionEnabled) {
        text = t('in-settings:tabs.syntheticTests');
        const tagFilterExpression = fromBackendModel(entity.tagFilterExpression);
        const { QueryBuilder } = getQueryBuilder();
        tooltipContent = (
          <div>
            <QueryBuilder value={tagFilterExpression} readOnly />
          </div>
        );
      } else if (entityAppNames.length === 0 && !entity.query) {
        text = t('in-settings:maintenanceWindow.allEntitiesColumn');
      }
      return (
        <Tooltip content={tooltipContent} delay={500} themeStyle="light">
          <span>{text}</span>
        </Tooltip>
      );
    }
  },
  {
    id: 'type',
    label: t('in-settings:tabs.type'),
    ellipsis: true,
    getValue(entity) {
      const mwType = entity.scheduling ? entity.scheduling.type : null;
      return mwType ? startCase(mwType.toLowerCase()) : mwType;
    },
    getContent(entity) {
      const mwType = entity.scheduling ? entity.scheduling.type : null;
      return mwType ? startCase(mwType.toLowerCase()) : mwType;
    }
  },
  {
    id: 'starts',
    label: t('in-settings:tabs.startTime'),
    ellipsis: true,
    getValue(entity) {
      if ((entity.state === 'UNSCHEDULED' && entity.scheduling.start === 1) || !entity.occurrence) {
        return '';
      }
      return getDateTimeFromFirstWindow('start', entity);
    },
    getContent(entity) {
      if ((entity.state === 'UNSCHEDULED' && entity.scheduling.start === 1) || !entity.occurrence) {
        return '';
      }
      return formatDateTime(new Date(entity.occurrence.start));
    }
  },
  {
    id: 'ends',
    label: t('in-settings:tabs.endTime'),
    ellipsis: true,
    getValue(entity) {
      return getEndTime(entity);
    },
    getContent(entity) {
      if ((entity.state === 'UNSCHEDULED' && entity.scheduling.start === 1) || !entity.occurrence) {
        return '';
      }
      return formatDateTime(new Date(entity.occurrence.end));
    }
  },
  {
    id: 'status',
    label: t('in-settings:tabs.status'),
    ellipsis: true,
    getValue: entity => (entity.paused ? 'PAUSED' : entity.state),
    getContent: function Content(entity) {
      const { paused, state } = entity;
      if (!state) return;

      return <RecurrentMaintenanceWindowStatusCell state={state} paused={paused} />;
    }
  }
];

const DisplayMWTypes = ({ mwTypeView, setMwTypeView, numbers }) => {
  const { trackCta } = useSegmentTracking();

  return (
    <div>
      <HorizontalFlexWrapper>
        <ButtonGroup
          buttonPropsList={[
            {
              text: `${t('in-settings:maintenanceWindow.status', { context: 'active' })} (${numbers.active})`,
              key: 'ACTIVE',
              onClick: () => {
                trackCta(SETTINGS_MAINTENANCE_WINDOW_ACTIVE_TAB);
                setMwTypeView('ACTIVE');
              }
            },
            {
              text: `${t('in-settings:maintenanceWindow.status', { context: 'scheduled' })} (${numbers.scheduled})`,
              key: 'SCHEDULED',
              onClick: () => {
                trackCta(SETTINGS_MAINTENANCE_WINDOW_SCHEDULED_TAB);
                setMwTypeView('SCHEDULED');
              }
            },
            {
              text: `${t('in-settings:maintenanceWindow.status', { context: 'expired' })} (${numbers.expired})`,
              key: 'EXPIRED',
              onClick: () => {
                trackCta(SETTINGS_MAINTENANCE_WINDOW_EXPIRED_TAB);
                setMwTypeView('EXPIRED');
              }
            }
          ]}
          segmented
          activeKey={mwTypeView}
        />
      </HorizontalFlexWrapper>
    </div>
  );
};

function getFormattedDateTimeOccurence(entity, startOrEnd) {
  if (entity.occurrence) {
    if (startOrEnd === 'start' && entity.occurrence.start) {
      return formatDateTime(new Date(entity.occurrence.start));
    } else if (startOrEnd === 'end' && entity.occurrence.end) {
      return formatDateTime(new Date(entity.occurrence.end));
    }
  } else {
    return null;
  }
}

function getDateTimeFromFirstWindow(key, entity) {
  if (entity.occurrence && entity.occurrence.start) {
    return entity.occurrence.start;
  } else {
    return null;
  }
}

function getEntityName(entity) {
  return t('in-settings:tabs.maintenanceWindowConfigurationEntityName', { entityName: entity.name });
}

function getEndTime(entity) {
  const duration = entity.scheduling && entity.scheduling.duration ? entity.scheduling.duration.amount : null;
  const durationUnit =
    entity.scheduling && entity.scheduling.duration ? entity.scheduling.duration.unit.toLowerCase() : null;

  if (!duration || !durationUnit) return null;

  return getEndAndTimeDurationOfWindow(duration, durationUnit, new Date(entity.scheduling.start));
}
