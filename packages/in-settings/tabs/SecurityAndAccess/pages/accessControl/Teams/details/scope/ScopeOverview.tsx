/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  CarbonAccordion,
  CarbonAccordionItem,
  CarbonContainedList,
  CarbonContainedListItem
} from '@instana/components';

import { ScopeOverviewProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/scope/ScopeOverview.types';
import { SCOPE_AREAS } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/scope/ScopeOverview.constants';

import locals from './ScopeOverview.mless';

const ScopeOverview = ({ team }: ScopeOverviewProps) => {
  return (
    <CarbonAccordion>
      {SCOPE_AREAS.map(area => {
        return (
          <CarbonAccordionItem
            key={area.id}
            title={
              <div className={locals.scopeTitle}>
                <div>{area.title}</div>
                <div>{area?.subtitle?.(team.scope)}</div>
              </div>
            }
          >
            {area?.items(team.scope)?.map(section => {
              return (
                <CarbonContainedList
                  key={`${area.id}-${section.id}`}
                  label={section.title ? section.title : ''}
                  className={section.title ? undefined : locals.hideTitle}
                >
                  {section?.items?.map((item: any) => {
                    return (
                      <CarbonContainedListItem key={`${section.id}-${item.scopeId}`}>
                        {item?.scopeId}
                      </CarbonContainedListItem>
                    );
                  })}
                </CarbonContainedList>
              );
            })}
          </CarbonAccordionItem>
        );
      })}
    </CarbonAccordion>
  );
};

export default ScopeOverview;
