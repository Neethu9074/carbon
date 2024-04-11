/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import { startCase } from 'lodash';

import { Link, Stack, Typography } from '@instana/components';
import { ButtonGroup } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { Button } from '@instana/legacy';

import {
  editMaintenanceWindowTracker,
  newMaintenanceWindowTracker,
  pauseMaintenanceWindowTracker,
  removeMaintenanceWindowTracker,
  resumeMaintenanceWindowTracker,
  switchToActiveMaintenanceWindowsTabTracker,
  switchToExpiredMaintenanceWindowsTabTracker,
  switchToScheduledMaintenanceWindowsTabTracker
} from 'in-settings/tracker';
import {
  pauseMaintenanceConfig,
  resumeMaintenanceConfig,
  getMaintenanceConfigsMutableV2,
  deleteMaintenanceConfigV2
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/api.ts';
import RecurrentMaintenanceConfigForm from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/RecurrentMaintenanceConfigForm';
import FeedbackDialog from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/feedback/FeedbackDialog';
import { getEndAndTimeDurationOfWindow } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/rruleHelpers';
import {
  getEntityIdView,
  teamSettingsAlertingMaintenanceConfigurations,
  getEntityHref
} from 'in-settings/navigation/paths';
import { getQueryBuilder } from 'in-alerting/smart-alerts/synthetics/components/AlertQueryBuilder';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import useSettingsEditor from 'in-settings/tabs/UserSettings/pages/useSettingsEditor';
import { recurrentMaintenanceWindowsTabsEnabled } from 'in-services/featureFlags';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { indeterminateProgress } from 'in-services/fixedObjects';
import { formatDateTime } from 'in-services/formatters/date';
import List from 'in-settings/components/List';
import WithIcon from 'in-components/WithIcon';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-components/Pill';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfiguration.mless';

export default function RecurrentMaintenanceWindowsList(props) {
  const getStartAsString = entity => getFormattedDateTimeOccurence(entity, 'start');
  const getEndAsString = entity => getFormattedDateTimeOccurence(entity, 'end');
  const [saved, setSaved] = useState(false);
  const allMaintenanceConfigs = useObservable(getMaintenanceConfigsMutableV2, [saved]) ?? indeterminateProgress;

  const [mwTypeView, setMwTypeView] = useState('ACTIVE');
  const [numbers, setNumbers] = useState({ active: 0, scheduled: 0, expired: 0 });
  const [settings, saveSetting] = useSettingsEditor();

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
        removeMaintenanceWindowTracker({
          mwID: entity.id,
          name: entity.name || null,
          type: entity.scheduling.type,
          currentState: entity.state
        });
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
          resumeMaintenanceWindowTracker(entityEventObject);
          return resumeMaintenanceConfig(entity.id);
        } else {
          pauseMaintenanceWindowTracker(entityEventObject);
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
                className={locals.shareFeedback}
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
          editMaintenanceWindowTracker();
          return getEntityHref(teamSettingsAlertingMaintenanceConfigurations, entity.id);
        }}
        trackEvent={newMaintenanceWindowTracker}
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

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-settings:tabs.name'),
    getContent: function Content(entity) {
      return (
        <Tooltip content={entity.name} align="topLeft" delay={500}>
          <Link href={getEntityIdView(teamSettingsAlertingMaintenanceConfigurations, entity.id)}>
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
      if (!entity.state) return;
      let mwStatusLabel = entity.state;
      if ((mwStatusLabel === 'ACTIVE' || mwStatusLabel === 'SCHEDULED') && entity.paused) {
        mwStatusLabel = 'PAUSED';
      }

      const mwColor = () => {
        if (mwStatusLabel === 'ACTIVE') return themes.default.ids.color.option.green['500'];
        if (mwStatusLabel === 'FINISHED' || mwStatusLabel === 'EXPIRED')
          return themes.default.ids.color.option.neutral['500'];
        if (mwStatusLabel === 'PAUSED') return themes.default.ids.color.option.yellow['500'];
        if (mwStatusLabel === 'SCHEDULED') return themes.default.ids.color.option.blue['500'];
        if (mwStatusLabel === 'UNSCHEDULED') return themes.default.ids.color.option['deep-purple']['500'];
        return themes.default.ids.color.option.neutral['800'];
      };
      const mwStatusLabelText = t('in-settings:maintenanceWindow.status', { context: mwStatusLabel.toLowerCase() });
      return (
        <Pill color={mwColor()}>
          {
            <Typography variant="body-small" onDark={mwStatusLabel !== 'PAUSED'}>
              {mwStatusLabelText}
            </Typography>
          }
        </Pill>
      );
    }
  }
];

const DisplayMWTypes = ({ mwTypeView, setMwTypeView, numbers }) => {
  return (
    <div>
      <HorizontalFlexWrapper>
        <ButtonGroup
          buttonPropsList={[
            {
              text: `${t('in-settings:maintenanceWindow.status', { context: 'active' })} (${numbers.active})`,
              key: 'ACTIVE',
              onClick: () => {
                switchToActiveMaintenanceWindowsTabTracker({});
                setMwTypeView('ACTIVE');
              }
            },
            {
              text: `${t('in-settings:maintenanceWindow.status', { context: 'scheduled' })} (${numbers.scheduled})`,
              key: 'SCHEDULED',
              onClick: () => {
                switchToScheduledMaintenanceWindowsTabTracker({});
                setMwTypeView('SCHEDULED');
              }
            },
            {
              text: `${t('in-settings:maintenanceWindow.status', { context: 'expired' })} (${numbers.expired})`,
              key: 'EXPIRED',
              onClick: () => {
                switchToExpiredMaintenanceWindowsTabTracker({});
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
