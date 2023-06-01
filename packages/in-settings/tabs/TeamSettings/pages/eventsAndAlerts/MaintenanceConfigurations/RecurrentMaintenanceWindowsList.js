/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import { startCase } from 'lodash';

import { Link, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';

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
} from './api';
import { getEntityIdView, teamSettingsAlertingMaintenanceConfigurations } from 'in-settings/navigation/paths';
import { recurrentMaintenanceWindowsTabsEnabled } from 'in-services/featureFlags';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import RecurrentMaintenanceConfigForm from './RecurrentMaintenanceConfigForm';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import { indeterminateProgress } from 'in-services/fixedObjects';
import { getEndAndTimeDurationOfWindow } from './rruleHelpers';
import { formatDateTime } from 'in-services/formatters/date';
import { getEntityHref } from 'in-settings/navigation/paths';
import ButtonGroup from 'in-components/ButtonGroup';
import WithIcon from 'in-components/WithIcon';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-components/Pill';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function RecurrentMaintenanceWindowsList(props) {
  const getStartAsString = getFormattedDateTimeFromFirstWindow.bind(null, 'start');
  const getEndAsString = getFormattedDateTimeFromFirstWindow.bind(null, 'end');
  const [saved, setSaved] = useState(false);
  const allMaintenanceConfigs = useObservable(getMaintenanceConfigsMutableV2, [saved]) ?? indeterminateProgress;

  const [mwTypeView, setMwTypeView] = useState('ACTIVE');
  const [numbers, setNumbers] = useState({ active: 0, scheduled: 0, expired: 0 });

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
    if (saved) setSaved(false);
  }, [saved]);

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
      disabled: entity => entity.state !== 'ACTIVE' && entity.state !== 'SCHEDULED',
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
        getHeader={
          recurrentMaintenanceWindowsTabsEnabled
            ? () => <DisplayMWTypes mwTypeView={mwTypeView} setMwTypeView={setMwTypeView} numbers={numbers} />
            : defaultHeaderWithCount(t('in-settings:tabs.maintenanceWindowConfigurations'))
        }
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
        searchAttributes={['name', 'scope', getStartAsString, getEndAsString, 'status']}
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
    getContent(entity) {
      return (
        <Tooltip content={entity.name} align="topLeft" delay={500}>
          <Link href$={getEntityIdView(teamSettingsAlertingMaintenanceConfigurations, entity.id)}>
            <WithIcon icon="lib_actions_build_outline" iconColor={theme.lib.colors.primary2} ellipsis>
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
    getContent(entity) {
      let text = '',
        tooltipContent = '';

      const entityAppNames = entity?.applicationNames || [];
      if (entityAppNames.length > 0) {
        text = `${entityAppNames.length} Applications`;
        entityAppNames.forEach((app, idx) => {
          if (idx < 5) tooltipContent = tooltipContent + app + ' ';
          if (idx === 5) tooltipContent = tooltipContent + '...';
        });
      } else if (entity.query) {
        text = 'DFQ';
        tooltipContent = entity.query;
      } else if (entityAppNames.length === 0 && !entity.query) {
        text = 'All Entities';
      }
      return (
        <Tooltip content={tooltipContent} delay={500}>
          <span>{text}</span>
        </Tooltip>
      );
    }
  },
  {
    id: 'type',
    label: t('in-settings:tabs.type'),
    ellipsis: true,
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
      return getDateTimeFromFirstWindow('start', entity);
    },
    getContent(entity) {
      if (entity.state === 'UNSCHEDULED' && entity.scheduling.start === 1) {
        return '';
      }
      return getFormattedDateTimeFromFirstWindow('start', entity);
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
      if (entity.state === 'UNSCHEDULED' && entity.scheduling.start === 1) {
        return '';
      }
      return formatDateTime(getEndTime(entity));
    }
  },
  {
    id: 'status',
    label: t('in-settings:tabs.status'),
    ellipsis: true,
    getContent(entity) {
      if (!entity.state) return;
      let mwStatusLabel = entity.state;
      if ((mwStatusLabel === 'ACTIVE' || mwStatusLabel === 'SCHEDULED') && entity.paused) {
        mwStatusLabel = 'PAUSED';
      }

      const mwColor = () => {
        if (mwStatusLabel === 'ACTIVE') return theme.lib.colors.green800;
        if (mwStatusLabel === 'FINISHED' || mwStatusLabel === 'EXPIRED') return theme.lib.colors.N500;
        if (mwStatusLabel === 'PAUSED') return theme.lib.colors.yellow800;
        if (mwStatusLabel === 'SCHEDULED') return theme.lib.colors.blue800;
        if (mwStatusLabel === 'UNSCHEDULED') return theme.lib.colors.deepPurple800;
        return theme.lib.colors.N800Dark;
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

function getFormattedDateTimeFromFirstWindow(key, entity) {
  if (entity.scheduling && entity.scheduling.start) {
    return formatDateTime(new Date(entity.scheduling.start));
  } else {
    return null;
  }
}

function getDateTimeFromFirstWindow(key, entity) {
  if (entity.scheduling && entity.scheduling.start) {
    return entity.scheduling.start;
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
