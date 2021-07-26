/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { SvgIcon } from '@instana/components';

import Divider from 'in-components/workspace/Divider/Divider';
import activationStages from 'in-amp/api/activationStages';
import { formatDate } from 'in-services/formatters/date';
import Tooltip from 'in-components/Tooltip';

import locals from './ActivationChecklist.mless';

/**
 * Renders the activation checklist, if activation data is supplied.
 * @param {object} accountInfo The retrieved account information, including the activation data.
 */
export default function ActivationChecklistWrapper({ accountInfo }) {
  const activation = accountInfo?.data?.activation;
  if (!activation || Object.keys(activation).length === 0) {
    return null;
  }
  return <ActivationChecklist activation={activation} />;
}

/**
 * The activation checklist, which consists of a menu to the left, containing the unit names,
 * and a checklist to the right, with a timestamp and checkmark if a stage in the activation was passed.
 * @param {object} accountInfo The retrieved account information, including the activation data.
 */
function ActivationChecklist({ activation }) {
  const [activeTenantUnit, setActiveTenantUnit] = useState(Object.keys(activation)[0]);

  return (
    <div className={locals.container}>
      <div className={locals.sideEntriesContainer}>
        {Object.keys(activation).map(tenantUnit => (
          <div
            key={tenantUnit}
            className={classNames({
              [locals.sideEntry]: true,
              [locals.sideEntryActive]: activeTenantUnit === tenantUnit
            })}
            onClick={() => setActiveTenantUnit(tenantUnit)}
          >
            {getUnitName(tenantUnit)}
            <Tooltip content={getTenantName(tenantUnit)}>
              <SvgIcon type="lib_help_error_info_circle" className={locals.infoIcon} size="xs" />
            </Tooltip>
          </div>
        ))}
      </div>
      <div className={locals.checklistContainer}>
        <div className={locals.checklist}>
          {activationStages.map((stage, index) => {
            const stageValue = activation[activeTenantUnit][stage.key];
            return (
              <div key={stage.key}>
                {index !== 0 && <Divider />}
                <div className={locals.checklistEntry}>
                  <div>
                    <div>{stage.label}</div>
                    <div className={locals.timestamp}>
                      {stageValue?.timestamp ? formatDate(stageValue.timestamp) : '---'}
                    </div>
                  </div>
                  <div>{stageValue?.status && <SvgIcon type="lib_check" className={locals.checkIcon} size="s" />}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Gets the tenant name from the tenant#unit name.
 * @param {string} tenantUnitName The name of the tenant unit.
 * @returns The tenant name, or the supplied name if the tenant name is not found.
 */
function getTenantName(tenantUnitName) {
  return tenantUnitName.split('#')[0] ?? tenantUnitName;
}

/**
 * Gets the unit name from the tenant#unit name.
 * @param {string} tenantUnitName The name of the tenant unit.
 * @returns The unit name, or the supplied name if the unit name is not found.
 */
function getUnitName(tenantUnitName) {
  return tenantUnitName.split('#')[1] ?? tenantUnitName;
}
