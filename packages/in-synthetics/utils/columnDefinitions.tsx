/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Link, Stack } from '@instana/components';

// @ts-expect-error Module needs to be translated to TS
import { MoreMenu, MoreMenuButton } from 'in-components/MoreMenu';
import { testResultSummaryPath, syntheticsPath } from 'in-synthetics/navigation/paths';
import { InteractiveElementsProps } from 'in-components/MoreMenu/MoreMenu';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import IconButton from 'in-components/IconButton/IconButton';
import { stopPropagation } from 'in-services/util/function';
import { getModifiedUrlStream } from 'in-stores/navigation';
import Tooltip from 'in-components/Tooltip';
import { SyntheticTest } from 'in-types';
import { t } from 'in-i18n';

import locals from './columnDefinitions.mless';

interface Props {
  test: SyntheticTest;
  isSubmitting: boolean;
  pauseOrResume: (test: SyntheticTest) => void;
  deleteTest: (id: string) => void;
}

export const columnDefinitions = [
  {
    id: 'name',
    width: '35%',
    sortable: false,
    getContent({ test }: Props) {
      return (
        <div>
          <Link
            href$={getModifiedUrlStream(summaryUrl => {
              summaryUrl.pathname = testResultSummaryPath;
              setOrDeleteMatrixKey(summaryUrl, syntheticsPath, 'testId', test.id);
              return summaryUrl;
            })}
          >
            <h4 className={locals.label}>{test.label}</h4>
          </Link>
        </div>
      );
    }
  },
  {
    id: 'playbackMode',
    width: '30%',
    sortable: false,
    getContent({ test: { playbackMode, locations } }: Props) {
      return (
        <div>
          <h4 className={locals.label}>{playbackMode}</h4>
          <span className={locals.secText}>
            {t('in-synthetics:dashboard.testList.locationsSubText', { count: locations.length })}
          </span>
        </div>
      );
    }
  },
  {
    id: 'type',
    width: '30%',
    sortable: false,
    getContent({ test: { configuration, testFrequency } }: Props) {
      return (
        <div>
          <h4 className={locals.label}>{configuration?.syntheticType}</h4>
          <span className={locals.secText}>
            {t('in-synthetics:dashboard.testList.frequencySubText', { count: testFrequency })}
          </span>
        </div>
      );
    }
  },
  {
    id: 'status',
    width: '5%',
    sortable: false,
    getContent({ test, pauseOrResume, isSubmitting, deleteTest }: Props) {
      return (
        <Stack align="center" distribution="spaceEvenly" direction="horizontal">
          <Tooltip
            content={
              test.active ? t('in-synthetics:dashboard.testList.pause') : t('in-synthetics:dashboard.testList.resume')
            }
          >
            <IconButton
              kind="primaryv2"
              type={isSubmitting ? 'lib_actions_loading' : test.active ? 'lib_actions_pause' : 'lib_actions_play'}
              iconSpinning={isSubmitting}
              onClick={() => pauseOrResume(test)}
              alignment="right"
            />
          </Tooltip>
          <MoreMenu
            renderInteractiveElement={({ ref, toggle }: InteractiveElementsProps) => (
              <IconButton
                kind="info"
                type="lib_menu_more_horizontal"
                onClick={e => {
                  stopPropagation(e);
                  toggle();
                }}
                ref={ref as React.MutableRefObject<HTMLButtonElement>}
              />
            )}
          >
            <MoreMenuButton icon="lib_actions_delete" onClick={() => deleteTest(test.id as string)}>
              {t('in-alerting:smartAlerts.applications.inventory.labelActionButtonDelete')}
            </MoreMenuButton>
          </MoreMenu>
        </Stack>
      );
    }
  }
];
