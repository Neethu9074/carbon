/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Message, Stack } from '@instana/components';

import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import PresentationSelection from 'in-amp/components/PresentationSelection';
import DropdownButton from 'in-components/Button/DropdownButton';
import AmpTimeSelection from 'in-amp/components/TimeSelection';
import { t } from 'in-i18n';

import locals from './AmpInformationModifier.mless';

const aggregatedState = { label: t('in-amp:components.ampInformationModifier.allPaidUnitsAggregated') };

export default function AmpInformationModifier({
  unitSelectorOptions,
  windowSize,
  setWindowSize,
  tenantUnit,
  setTenantUnit,
  timeRange,
  setTimeRange,
  setTo,
  presentation,
  setPresentation
}) {
  const showAggregatedMetrics = tenantUnit.label === aggregatedState.label;

  return (
    <div
      className={classNames({
        [locals.buttonHeader]: true,
        [locals.buttonHeaderReverse]: !unitSelectorOptions
      })}
    >
      {unitSelectorOptions && (
        <Stack>
          {showAggregatedMetrics && (
            <Message
              className={locals.message}
              withIcon
              title={t(
                'in-amp:components.ampInformationModifier.customerUsageIsReportedAcrossAllUnitsOfYourAccountWithAPaidLicense'
              )}
            />
          )}
          <ComboBoxBehavior
            align="bottomRight"
            value={unitSelectorOptions.find(({ label }) => label === tenantUnit.label)?.value}
            options={unitSelectorOptions}
            onChange={setTenantUnit}
            disableAutomaticOptionSorting
          >
            {({ elementProps, isOpen }) => (
              <DropdownButton {...elementProps} kind="secondary" expanded={isOpen}>
                {tenantUnit.label}
              </DropdownButton>
            )}
          </ComboBoxBehavior>
        </Stack>
      )}
      <div>
        <AmpTimeSelection
          windowSize={windowSize}
          setWindowSize={setWindowSize}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          setTo={setTo}
          presentation={presentation}
          setPresentation={setPresentation}
        />
        {presentation && (
          <PresentationSelection presentation={presentation} setPresentation={setPresentation} timeRange={timeRange} />
        )}
      </div>
    </div>
  );
}
