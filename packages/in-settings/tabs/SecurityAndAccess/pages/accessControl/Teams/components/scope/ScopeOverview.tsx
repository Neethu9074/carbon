/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Accordion, AccordionItem } from '@instana/carbon';

import { ScopeOverviewProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeOverview.types';
import ScopeOverviewSection from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeOverviewSection';
import { SCOPE_AREAS } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeOverview.constants';
import useTimeConfig from 'in-hooks/useTimeConfig';

import locals from './ScopeOverview.mless';

const ScopeOverview = ({ team }: ScopeOverviewProps) => {
  const timeConfig = useTimeConfig();
  return (
    <Accordion>
      {SCOPE_AREAS.map(area => {
        return (
          <AccordionItem
            key={area.id}
            title={
              <div className={locals.scopeTitle}>
                <div>{area.title}</div>
                <div>{area?.subtitle?.(team.scope)}</div>
              </div>
            }
          >
            {area?.items(team.scope, timeConfig)?.map(section => {
              return <ScopeOverviewSection key={`${area.id}-${section.id}`} areaId={area.id} section={section} />;
            })}
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default ScopeOverview;
