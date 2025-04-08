/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import {
  CarbonPopover as Popover,
  CarbonPopoverContent as PopoverContent,
  CarbonTag as Tag,
  CarbonTile as Tile,
  CarbonContainedList as ContainedList,
  CarbonContainedListItem as ContainedListItem
} from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';
import { TestResultListItem } from '@instana/types';
import { t } from '@instana/i18n-react';

import { getResultErrorMessage } from 'in-synthetics/dashboards/details/utils';

import locals from 'in-synthetics/dashboards/summary/tabs/results/ResultsList.mless';

const FailureTypePopover = ({ resultItem }: { resultItem: TestResultListItem }) => {
  const [openFailurePopover, setOpenFailurePopover] = useState(false);
  const errors = resultItem?.testResultCommonProperties?.errors ?? [];
  const handleFailureListClose = () => {
    setOpenFailurePopover(false);
  };

  const handleFailureListOpen = () => {
    setOpenFailurePopover(true);
  };

  return errors && errors?.length > 0 ? (
    <span>
      <Tag size="md" type="blue">
        {getResultErrorMessage(errors[0])}
      </Tag>
      {errors.length > 1 && (
        <Popover open={openFailurePopover} align="bottom-end" onRequestClose={handleFailureListClose}>
          <Tag size="md" type="gray" onClick={handleFailureListOpen}>
            {`${errors.length - 1} +`}
          </Tag>
          <PopoverContent className={locals.popoverContent}>
            <Tile>
              <ContainedList label={''} size="sm" kind="disclosed">
                {errors.slice(1).map((error: string) => (
                  <ContainedListItem key={generateUniqueShortId()}>{getResultErrorMessage(error)}</ContainedListItem>
                ))}
              </ContainedList>
            </Tile>
          </PopoverContent>
        </Popover>
      )}
    </span>
  ) : (
    <span className={locals.noData}>{t('in-synthetics:dashboard.resultsListPage.dns.na')}</span>
  );
};
export default FailureTypePopover;
