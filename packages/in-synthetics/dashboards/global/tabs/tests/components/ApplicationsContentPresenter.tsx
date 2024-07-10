/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { TestResultListItem } from '@instana/types';
import { Link, SvgIcon } from '@instana/components';
import { t } from '@instana/i18n-react';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { useLinkToApplicationDashboard } from 'in-applications/navigation/paths';
import Overlay from 'in-components/overlays/Overlay/Overlay';

import locals from 'in-synthetics/dashboards/global/tabs/tests/components/columnDefinitions.mless';

interface Props {
  item: TestResultListItem;
}

const ApplicationsContentPresenter = ({ item }: Props) => {
  const applicationLabels = item.testResultCommonProperties?.testCommonProperties?.applicationLabels || [];
  const applicationIds = item.testResultCommonProperties?.testCommonProperties?.applicationIds || [];

  if (applicationLabels.length !== 0) {
    return (
      <Overlay props={{ applicationIds, applicationLabels }} content={Content}>
        {({ toggle }) => (
          <HorizontalFlexWrapper>
            <SvgIcon type={'lib_application_invert'} />
            <div onClick={toggle}>
              <span className={locals.labelApp}>
                {applicationLabels.length === 1
                  ? t('in-synthetics:dashboard.testList.multiAppDialog.singleAppHeader', {
                      number: applicationLabels.length
                    })
                  : t('in-synthetics:dashboard.testList.multiAppDialog.multiAppHeader', {
                      number: applicationLabels.length
                    })}
              </span>
            </div>
          </HorizontalFlexWrapper>
        )}
      </Overlay>
    );
  }

  return (
    <div>
      <span className={locals.label}>{''}</span>
    </div>
  );
};

interface ContentProps {
  applicationIds: string[];
  applicationLabels: string[];
  close: () => void;
}

const constructAppsMap = (applicationLabels: string[], applicationIds: string[]) => {
  if (applicationLabels.length !== applicationIds.length) {
    return null;
  }

  const map = new Map();
  for (let i = 0; i < applicationLabels.length; i++) {
    map.set(applicationLabels[i], applicationIds[i]);
  }
  return map;
};

const Content = (props: ContentProps) => {
  const getLinkToApplicationDashboard = useLinkToApplicationDashboard();
  const { applicationIds, applicationLabels, close } = props;
  const mapToMatch = constructAppsMap(applicationLabels, applicationIds);
  return (
    <section>
      <h1 className={locals.overlayHeader}>
        <div className={locals.title}>
          {applicationLabels.length === 1
            ? t('in-synthetics:dashboard.testList.multiAppDialog.singleAppSpan', {
                number: applicationLabels?.length
              })
            : t('in-synthetics:dashboard.testList.multiAppDialog.multiAppSpan', {
                number: applicationLabels?.length
              })}
        </div>
        <SvgIcon type="lib_openclose_cancel" size="l" onClick={close} />
      </h1>
      <ol className={locals.issues}>
        {applicationLabels?.map(applicationLabel => {
          const applicationId = mapToMatch?.get(applicationLabel);
          return (
            <li key={generateUniqueShortId()} className={locals.issue}>
              <Link href={getLinkToApplicationDashboard({ applicationId })}>
                <span className={locals.label}>{applicationLabel}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default ApplicationsContentPresenter;
