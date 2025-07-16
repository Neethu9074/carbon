/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { SvgIcon } from '@instana/components';
import { ComboBox } from '@instana/carbon';

import { newAccountAndBillingPageEnabled } from 'in-services/featureFlags';
import activationStages from 'in-amp/api/activationStages';
import { formatDate } from 'in-services/formatters/date';
import Divider from 'in-components/workspace/Divider';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

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
  const tenantUnits = Object.keys(activation);
  const [activeTenantUnit, setActiveTenantUnit] = useState(tenantUnits[0]);

  if (newAccountAndBillingPageEnabled) {
    const tenantOptions = tenantUnits.map(unit => ({
      label: getUnitName(unit),
      value: unit
    }));

    return (
      <div>
        <ComboBox
          id="tenantUnitSelector"
          name="tenantUnitSelector"
          titleText={t('in-amp:components.activationAdoption.activationStages.tenantUnit')}
          size="md"
          items={tenantOptions}
          selectedItem={tenantOptions.find(option => option.value === activeTenantUnit)}
          itemToString={item => (item ? item.label : '')}
          onChange={({ selectedItem }) => {
            const selectedValue = selectedItem?.value || tenantUnits[0];
            setActiveTenantUnit(selectedValue);
          }}
          className={locals.combocontainer}
        />
        <div className={locals.checklist_margin}>
          {activationStages.map(stage => {
            const stageValue = activation[activeTenantUnit][stage.key];
            return (
              <div key={stage.key} className={locals.comboboxEntry}>
                <div className={locals.iconAndText}>
                  <div className={locals.iconWrapper}>
                    {stageValue?.status ? (
                      <SvgIcon type="lib_uncheck" className={locals.CheckIconSuccess} size="s" />
                    ) : (
                      <SvgIcon type="lib_circle_dash" size="s" />
                    )}
                  </div>
                  <div>
                    <div>{stage.label}</div>
                    <div className={locals.timestamp}>
                      {stageValue?.timestamp
                        ? formatDate(stageValue.timestamp)
                        : t('in-amp:components.activationAdoption.activationStages.notStarted')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
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
