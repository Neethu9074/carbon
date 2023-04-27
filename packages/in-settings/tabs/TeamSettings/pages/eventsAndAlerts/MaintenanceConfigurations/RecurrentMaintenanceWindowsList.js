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
} from 'in-api/maintenanceConfiguration';
import { getEntityIdView, teamSettingsAlertingMaintenanceConfigurations } from 'in-settings/navigation/paths';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import RecurrentMaintenanceConfigForm from './RecurrentMaintenanceConfigForm';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { getEndAndTimeDurationOfWindow } from './rruleHelpers';
import { formatDateTime } from 'in-services/formatters/date';
import { pendingResult } from 'in-services/fixedObjects';
import { toTitleCase } from 'in-services/util/string';
import ButtonGroup from 'in-components/ButtonGroup';
import List from 'in-settings/components/List';
import WithIcon from 'in-components/WithIcon';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-components/Pill';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function RecurrentMaintenanceWindowsList(props) {
  const getStartAsString = getFormattedDateTimeFromFirstWindow.bind(null, 'start');
  const getEndAsString = getFormattedDateTimeFromFirstWindow.bind(null, 'end');
  const [saved, setSaved] = useState(false);
  const getter = useObservable(getMaintenanceConfigsMutableV2, [saved]) ?? pendingResult;

  const [mwTypeView, setMwTypeView] = useState('ACTIVE');
  const [mwData, setMWData] = useState([]);
  const defaultNumState = { active: 0, scheduled: 0, expired: 0 };
  const [numbers, setNumbers] = useState(defaultNumState);

  useEffect(() => {
    if (Array.isArray(getter) && getter.length !== mwData.length) setMWData(getter);
  }, [getter, mwData]);

  useEffect(() => {
    let initialNumState = { active: 0, paused: 0, scheduled: 0, expired: 0 };
    mwData.forEach(mw => {
      if (mw.state === 'ACTIVE') initialNumState = { ...initialNumState, active: initialNumState.active + 1 };
      if (mw.state === 'SCHEDULED') initialNumState = { ...initialNumState, scheduled: initialNumState.scheduled + 1 };
      if (mw.state === 'FINISHED' || mw.state === 'UNSCHEDULED')
        initialNumState = { ...initialNumState, expired: initialNumState.expired + 1 };
    });
    setNumbers(initialNumState);
  }, [mwData, saved]);

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
      get: entity => entity.paused,
      toggle: entity => {
        const entityEventObject = {
          mwID: entity.id,
          name: entity.name || null,
          type: entity.scheduling.type,
          currentState: entity.state
        };
        if (entity.paused) {
          resumeMaintenanceConfig(entity.id);
          resumeMaintenanceWindowTracker(entityEventObject);
        } else {
          pauseMaintenanceConfig(entity.id);
          pauseMaintenanceWindowTracker(entityEventObject);
        }
      },
      disabled: entity => entity.state !== 'ACTIVE' && entity.state !== 'SCHEDULED'
    }
  };

  return (
    <div>
      <Typography variant="heading-300" component="span">
        {t('in-settings:tabs.maintenanceWindowConfigurations')}
      </Typography>
      <List
        title={t('in-settings:tabs.maintenanceWindowConfigurations')}
        getHeader={() => {
          return <DisplayMWTypes mwTypeView={mwTypeView} setMwTypeView={setMwTypeView} numbers={numbers} />;
        }}
        getEntityName={getEntityName}
        columnDefinitions={columnDefinitions}
        tableActions={tableActions}
        loadEntities={getMaintenanceConfigsMutableV2}
        initialOrderBy="name"
        labelNew={t('in-settings:tabs.scheduleMaintenanceWindow')}
        onCreateNew={() => {
          addActiveDialog(<RecurrentMaintenanceConfigForm {...props} onClose={close} setSaved={setSaved} />);
        }}
        onRowClick={entity => {
          editMaintenanceWindowTracker();
          addActiveDialog(<RecurrentMaintenanceConfigForm {...props} onClose={close} existingID={entity.id} />);
        }}
        trackEvent={newMaintenanceWindowTracker}
        searchAttributes={['name', 'scope', getStartAsString, getEndAsString, 'status']}
        extraFilters={[element => filteringMWList(element, mwTypeView)]}
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
          <Link href$={getEntityIdView(teamSettingsAlertingMaintenanceConfigurations)}>
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
      return formatDateTime(getEndTime(entity));
    }
  },
  {
    id: 'status',
    label: t('in-settings:tabs.status'),
    ellipsis: true,
    getContent(entity) {
      const mwStatusLabel = entity.state;
      const mwColor = () => {
        if (mwStatusLabel === 'ACTIVE') return '#288657';
        if (mwStatusLabel === 'FINISHED') return theme.lib.colors.N800Dark;
        if (mwStatusLabel === 'PAUSED') return theme.lib.colors.yellow800;
        if (mwStatusLabel === 'SCHEDULED') return theme.lib.colors.blue800;
        return theme.lib.colors.N800Dark;
      };

      return entity.state ? (
        <Pill color={mwColor()}>
          {
            <Typography variant="body-small" onDark={mwStatusLabel !== 'PAUSED'}>
              {toTitleCase(mwStatusLabel)}
            </Typography>
          }
        </Pill>
      ) : null;
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
              text: `${t('in-settings:tabs.active')} (${numbers.active})`,
              key: 'ACTIVE',
              onClick: () => {
                switchToActiveMaintenanceWindowsTabTracker({});
                setMwTypeView('ACTIVE');
              }
            },
            {
              text: `${t('in-settings:tabs.scheduled')} (${numbers.scheduled})`,
              key: 'SCHEDULED',
              onClick: () => {
                switchToScheduledMaintenanceWindowsTabTracker({});
                setMwTypeView('SCHEDULED');
              }
            },
            {
              text: `${t('in-settings:tabs.expired')} (${numbers.expired})`,
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
