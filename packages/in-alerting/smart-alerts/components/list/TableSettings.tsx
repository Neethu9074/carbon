/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState, useCallback } from 'react';
import classNames from 'classnames';

import {
  Button,
  CarbonPopover,
  CarbonPopoverContent,
  Dropdown,
  IconButton,
  RadioButton,
  Spacer,
  Stack
} from '@instana/components';

import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

import locals from './TableSettings.mless';

export const ACTIVE = 'active';
export const ARCHIVED = 'inactive';

//TODO replace this with value needs to be passed to the API
export const ALERT_TYPE = {
  WARNING_CRITICAL: t('in-alerting:table.warningAndCritical'),
  WARNING: t('in-alerting:table.warning'),
  CRITICAL: t('in-alerting:table.critical')
};

const alertStatus = [
  {
    value: ACTIVE,
    label: t('in-alerting:table.active')
  },
  {
    value: ARCHIVED,
    label: t('in-alerting:table.inactive')
  }
];

interface FilterProps {
  alertType: string;
  status: string;
}

const FILTER = 'filter';
const SETTINGS = 'settings';

export default function TableSettings({
  handleSettings,
  handleFilter
}: {
  handleSettings: (status: string) => void;
  handleFilter: (filter: FilterProps) => void;
}) {
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [settings, setSettings] = useState(ACTIVE);
  const [filter, setFilter] = useState({ alertType: '', status: ACTIVE });

  const handleClick = useCallback((id: string) => {
    setActivePopover(prevId => (prevId === id ? null : id));
  }, []);

  return (
    <span className={locals.toolbar}>
      <SettingsPopoverContent
        icon="lib_actions_filter"
        id={FILTER}
        isActive={activePopover === FILTER}
        handleClick={handleClick}
      >
        <Stack gap="xsmall">
          <div className={locals.title}>
            <AlertTypography variant="heading-02" content={t('in-alerting:table.filter')} />
          </div>
          <AlertTypography variant="label-01" content={t('in-alerting:table.alertType')} />
          <RadioButton
            label={ALERT_TYPE.WARNING_CRITICAL}
            onChange={() => applyFilterQuery({ alertType: ALERT_TYPE.WARNING_CRITICAL }, setFilter, filter)}
          />
          <RadioButton
            label={ALERT_TYPE.WARNING}
            onChange={() => applyFilterQuery({ alertType: ALERT_TYPE.WARNING }, setFilter, filter)}
          />
          <RadioButton
            label={ALERT_TYPE.CRITICAL}
            onChange={() => applyFilterQuery({ alertType: ALERT_TYPE.CRITICAL }, setFilter, filter)}
          />

          <AlertTypography variant="label-01" content={t('in-alerting:table.notificationChannel')} />

          <AlertTypography variant="label-01" content={t('in-alerting:table.status')} />
          <Dropdown
            items={alertStatus}
            value={t('in-alerting:table.active')}
            onChange={status => applyFilterQuery({ status }, setFilter, filter)}
          />
          <Spacer size="large" />
          <Stack gap="normal" direction="horizontal" distribution="center">
            <Button kind="action">{t('in-alerting:table.cancel')}</Button>
            <Button kind="primary" onClick={() => handleFilter(filter)}>
              {t('in-alerting:table.apply')}
            </Button>
          </Stack>
        </Stack>
      </SettingsPopoverContent>
      <SettingsPopoverContent
        icon="lib_actions_settings"
        id={SETTINGS}
        isActive={activePopover === SETTINGS}
        handleClick={handleClick}
      >
        <Stack gap="xsmall">
          <div className={locals.title}>
            <AlertTypography variant="label-01" content={t('in-alerting:table.tableDataSettings')} />
          </div>
          <RadioButton
            label={t('in-alerting:table.active')}
            checked={settings === ACTIVE}
            onChange={() => {
              setSettings(ACTIVE);
              handleSettings(ACTIVE);
            }}
          />
          <RadioButton
            label={t('in-alerting:table.inactive')}
            checked={settings === ARCHIVED}
            onChange={() => {
              setSettings(ARCHIVED);
              handleSettings(ARCHIVED);
            }}
          />
        </Stack>
      </SettingsPopoverContent>
    </span>
  );
}

const applyFilterQuery = (
  filterData: { [key: string]: string },
  setFilter: React.Dispatch<React.SetStateAction<FilterProps>>,
  filter: FilterProps
) => {
  setFilter({ ...filter, ...filterData });
};

export function SettingsPopoverContent({
  icon,
  id,
  children,
  isActive,
  handleClick
}: {
  icon: string;
  id: string;
  children: JSX.Element;
  isActive: boolean;
  handleClick: (id: string) => void;
}) {
  return (
    <CarbonPopover open={isActive} align="bottom-end">
      <IconButton className={locals.icon} type={icon} onClick={() => handleClick(id)} size="compact" kind="action" />
      <CarbonPopoverContent
        className={classNames({
          [locals.filterContent]: id === FILTER,
          [locals.popoverContent]: id !== FILTER
        })}
      >
        {children}
      </CarbonPopoverContent>
    </CarbonPopover>
  );
}
