/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { CarbonPopover, CarbonPopoverContent, CarbonButton, CarbonCheckbox, SvgIcon } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { pendingResult } from 'in-services/fixedObjects';
import { getTeamsOverview } from 'in-api/teams';
import { t } from 'in-i18n';

import locals from './AlertChannelsFilter.mless';

export default function AlertChannelsFilter({ setUrlState, onLoadFilters }) {
  const teamsList = useObservable(getTeamsOverview, []) ?? pendingResult;
  const prefix = 'cds';
  const [isOpen, setIsOpen] = useState(false);
  const [thisFilteredList, setThisFilteredList] = useState(onLoadFilters);
  return (
    <CarbonPopover open={isOpen} isTabTip onRequestClose={() => setIsOpen(false)} align={'bottom-end'}>
      <button
        aria-label="Filtering"
        type="button"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={locals.filterButton}
      >
        <SvgIcon type={'lib_actions_filter'} size="xs" className={locals.filter} />
      </button>
      <CarbonPopoverContent id={'alertChannelsTeamFilter'}>
        <div className={`${prefix}--container-checkbox`}>
          <fieldset className={`${prefix}--fieldset`}>
            <legend className={`${prefix}--label`}>
              <div className={locals.header}>{t('in-settings:tabs.teams.teamFilterOptions')}</div>
            </legend>
            <div className={locals.content}>
              {teamsList?.data?.map(team => {
                return (
                  <CarbonCheckbox
                    labelText={team.name}
                    id={team.name}
                    onChange={() => {
                      if (thisFilteredList.includes(team.name)) {
                        setThisFilteredList(thisFilteredList.filter(item => item !== team.name));
                      } else {
                        setThisFilteredList(thisFilteredList.concat([team.name]));
                      }
                    }}
                    checked={thisFilteredList.includes(team.name)}
                  />
                );
              })}
            </div>
          </fieldset>
        </div>
        <CarbonButton
          kind="secondary"
          title={t('in-settings:tabs.teams.teamFilterReset')}
          onClick={() => {
            setThisFilteredList([]);
            setUrlState({ filter: [] });
          }}
        >
          {t('in-settings:tabs.teams.teamFilterReset')}
        </CarbonButton>
        <CarbonButton
          kind="primary"
          title={t('in-settings:tabs.teams.teamApplyFilters')}
          onClick={() => {
            setUrlState({ filter: thisFilteredList });
          }}
        >
          {t('in-settings:tabs.teams.teamApplyFilters')}
        </CarbonButton>
      </CarbonPopoverContent>
    </CarbonPopover>
  );
}
