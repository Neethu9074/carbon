/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import { Dropdown } from '@instana/components';
import { SvgIcon } from '@instana/components';

import activationStages from 'in-amp/api/activationStages';
import FunnelTile from 'in-amp/components/FunnelTile';
import { t } from 'in-i18n';

import locals from './ActivationFunnelTile.mless';

/**
 * The activation tile of the funnel.
 * Renders a dropdown with tenant units and a checklist of activations for the selected unit.
 * @param {number} position The position the tile is in the funnel, from the left.
 * @param {object} accountInfo The retrieved account information, including the activation data.
 */
export default function ActivationFunnelTile({ position, accountInfo }) {
  return (
    <FunnelTile
      title={t('in-amp:components.activationAdoption.activation')}
      backgroundColor="rgba(180, 215, 232, 0.34)"
      position={position}
    >
      {accountInfo?.data?.activation && (
        <ActivationFunnelTileContent activationByEnvironmentId={accountInfo.data.activation} />
      )}
    </FunnelTile>
  );
}

/**
 * The content of the activation tile.
 * @param {object} activationByEnvironmentId The list of activations per tenant unit.
 */
function ActivationFunnelTileContent({ activationByEnvironmentId }) {
  const [tenantUnit, setTenantUnit] = useState(Object.keys(activationByEnvironmentId)[0] ?? null);

  const dropdownOptions = Object.keys(activationByEnvironmentId).map(value => ({
    value,
    label: parseTenantUnitName(value)
  }));

  return (
    <div className={locals.container}>
      <Dropdown
        items={dropdownOptions}
        size="sm"
        value={tenantUnit}
        onChange={setTenantUnit}
        className={locals.activationDropdown}
      />

      <div className={locals.entriesContainer}>
        {activationStages.map(stage => {
          const val = activationByEnvironmentId[tenantUnit][stage.key];
          if (!val) {
            return null;
          }
          return (
            <div key={stage.key} className={locals.entry}>
              <div className={locals.iconContainer}>
                {val.status && <SvgIcon type="lib_check" className={locals.checkIcon} size="xs" />}
              </div>
              <div>{stage.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Replaces the # in the internal tenant unit name with a dash.
 * @param {string} name The internal tenant unit name.
 * @returns The parsed tenant unit name with a dash between tenant and unit.
 */
function parseTenantUnitName(name) {
  const tenantUnitParts = name.split('#');
  if (tenantUnitParts.length !== 2) {
    return name;
  }
  return `${tenantUnitParts[1]}-${tenantUnitParts[0]}`;
}
