/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import AmpTimeSelection from 'in-amp/components/TimeSelection';
import Message from 'in-new-components/Message';
import { t } from 'in-i18n';

import locals from './AmpInformationModifier.mless';

const aggregatedState = { label: t('in-amp:components.ampInformationModifier.allPaidUnitsAggregated') };

export default function AmpInformationModifier({
  unitSelectorOptions,
  windowSize,
  setWindowSize,
  tenantUnit,
  setTenantUnit
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
        <HorizontalFlexWrapper>
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
          {showAggregatedMetrics && (
            <Message
              className={locals.message}
              withIcon
              title={t(
                'in-amp:components.ampInformationModifier.customerUsageIsReportedAcrossAllUnitsOfYourAccountWithAPaidLicense'
              )}
            />
          )}
        </HorizontalFlexWrapper>
      )}
      {!showAggregatedMetrics && <AmpTimeSelection windowSize={windowSize} setWindowSize={setWindowSize} />}
    </div>
  );
}
