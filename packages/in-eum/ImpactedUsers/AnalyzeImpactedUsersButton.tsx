/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useCallback, useState, useRef, useEffect } from 'react';

import { HorizontalIndicator, Button } from '@instana/components';
import { Disposable } from '@instana/observables';

import {
  getImpactedBeaconByTrace,
  downloadImpactedBeaconByTrace
} from 'in-eum/ImpactedUsers/BeaconByTraceQueryHandler';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import { getImpactedBeacon, downloadImpactedBeacon } from 'in-eum/ImpactedUsers/ImpactedBeaconsQueryHandler';
import { FormModelElement, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { Error, Nullish, Progress, TagFilterExpressionElementUnion, TimeConfig } from 'in-types';
import DescriptionText from 'in-components/form/DescriptionText/DescriptionText';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
// @ts-ignore
import * as entityUtils from 'in-services/entityUtils';
import { useEumTracker } from 'in-eum/tracking/segTracker';
import { t } from 'in-i18n';

interface AnalyzeImpactedUsersButtonProps {
  entityType?: string | unknown;
  alertType?: string;
  disabled?: boolean;
  timeConfig?: TimeConfig | null;
  tagFilterExpression: TagFilterExpressionElementUnion;
}

interface ImpactedBeaconTagFilterExpressionProps {
  alertId?: string | Nullish;
  entityId?: string;
  entityType?: string | unknown;
  excludeViolationRelatedFilters?: boolean;
}

export default function AnalyzeImpactedUsersButton({
  entityType,
  alertType,
  disabled,
  timeConfig,
  tagFilterExpression
}: AnalyzeImpactedUsersButtonProps) {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [errors, setErrors] = useState<Array<Error>>([]);
  const subscriptionRef = useRef<Disposable | null>(null);
  const { applicationsEumImpactedUsers } = useEumTracker();

  useEffect(
    () => () => {
      subscriptionRef.current?.dispose();
      subscriptionRef.current = null;
    },
    []
  );

  const getHandlers = useCallback(() => {
    if (entityUtils.isWebsiteEntityType(entityType) || entityUtils.isMobileAppEntityType(entityType)) {
      return {
        getBeacon: getImpactedBeacon,
        downloadBeacon: downloadImpactedBeacon
      };
    }
    return {
      getBeacon: getImpactedBeaconByTrace,
      downloadBeacon: downloadImpactedBeaconByTrace
    };
  }, [entityType]);

  const onClickDownload = useCallback(() => {
    const { getBeacon, downloadBeacon } = getHandlers();
    subscriptionRef.current = getBeacon(timeConfig, tagFilterExpression, alertType, entityType)
      .startWith(null)
      .subscribe(result => {
        const loading = result?.progress?.loading ?? true;
        setProgress({
          loading: loading,
          percentage: result?.progress?.percentage ? result.progress.percentage * 100 : undefined
        });
        setErrors(result?.errors ?? []);
        if (!loading && subscriptionRef.current && result?.data) {
          downloadBeacon(
            result.data,
            typeof entityType === 'string' ? entityType : '',
            typeof alertType === 'string' ? alertType : ''
          );
          subscriptionRef.current.dispose();
          subscriptionRef.current = null;
        }
      });
  }, [alertType, tagFilterExpression, timeConfig, getHandlers, entityType]);

  return (
    <>
      {progress?.loading && <HorizontalIndicator progress={progress} />}
      <Button
        kind="primary"
        icon="lib_actions_download"
        onClick={e => {
          e.stopPropagation();
          onClickDownload();
          applicationsEumImpactedUsers();
        }}
        disabled={disabled || progress?.loading}
      >
        {t('in-eum:generateImpactReport.button')}
      </Button>
      {!!errors.length && (
        <DescriptionText>
          <ErroneousResultPresenter errors={errors} />
        </DescriptionText>
      )}
    </>
  );
}

export function getEnrichedAnalyzeTagFilterFormModelImpactedBeacons({
    alertId,
    entityId,
    entityType,
    excludeViolationRelatedFilters
  }: ImpactedBeaconTagFilterExpressionProps) {
    const tagFilterName = excludeViolationRelatedFilters
      ? entityUtils.isMobileAppEntityType(entityType)
        ? 'mobileBeacon.mobileApp.id'
        : 'beacon.website.id'
      : 'impactedBeacon.websiteOrMobileApp.id';

    const eumAlertId = excludeViolationRelatedFilters ? null : alertId;

    return joinExpressions({
      expressions: [
        eumAlertId ? tagFilter('impactedBeacon.alertId', EQUALS, eumAlertId) : null,
        entityId ? tagFilter(tagFilterName, EQUALS, entityId) : null
      ].filter(Boolean) as (FormModelElement | FormModelElement[])[]
    });
  }
