/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  CarbonPopover as Popover,
  CarbonPopoverContent as PopoverContent,
  CarbonTag as Tag,
  CarbonTile as Tile,
  CarbonContainedList as ContainedList,
  CarbonContainedListItem as ContainedListItem,
  Tooltip as CarbonTooltip
} from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';
import { TestResultListItem } from '@instana/types';
import { t } from '@instana/i18n-react';

import { formatErrorMessage, getResultErrorMessage } from 'in-synthetics/dashboards/details/utils';
import usePopoverClickHandler from 'in-synthetics/utils/usePopoverClickHandler';

import locals from 'in-synthetics/dashboards/summary/tabs/results/ResultsList.mless';

const FailureTypePopover = ({ resultItem }: { resultItem: TestResultListItem }) => {
  const errors = resultItem?.testResultCommonProperties?.errors ?? [];
  const { open, toggle } = usePopoverClickHandler();

  return errors && errors?.length > 0 ? (
    <span className={locals.failureType}>
      <CarbonTooltip content={getResultErrorMessage(errors[0])}>
        <Tag size="md" type="blue" className={locals.errorTag}>
          {formatErrorMessage(errors[0], 35)}
        </Tag>
      </CarbonTooltip>
      {errors.length > 1 && (
        <Popover open={open} caret={false} dropShadow align="left-start" onMouseEnter={toggle} onMouseLeave={toggle}>
          <PopoverContent className={locals.popoverContent}>
            <Tile>
              <ContainedList label={''} size="sm" kind="disclosed">
                {errors.slice(1).map((error: string) => (
                  <ContainedListItem key={generateUniqueShortId()}>{getResultErrorMessage(error)}</ContainedListItem>
                ))}
              </ContainedList>
            </Tile>
          </PopoverContent>
          <Tag size="md" type="gray" onClick={toggle}>
            {`${errors.length - 1} +`}
          </Tag>
        </Popover>
      )}
    </span>
  ) : (
    <span className={locals.noData}>{t('in-synthetics:dashboard.resultsListPage.dns.na')}</span>
  );
};
export default FailureTypePopover;
