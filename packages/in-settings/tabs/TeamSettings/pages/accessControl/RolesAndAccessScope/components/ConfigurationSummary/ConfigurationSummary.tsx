/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode } from 'react';

import { Typography } from '@instana/components';

import {
  LimitableProductArea,
  ProductArea
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { syntheticMultiAppEnabled } from 'in-services/featureFlags';
import PreviewBadge from 'in-components/PreviewBadge/PreviewBadge';
import Label from 'in-components/form/Label/Label';
import { t } from 'in-i18n';

import locals from './ConfigurationSummary.mless';

export interface ConfigurationSummaryProps {
  accessLevelType?: string;
  accessLevelMsg?: string | JSX.Element;
  noAccess?: boolean;
  children?: ReactNode;
  noAccessMsg?: string;
  productArea?: LimitableProductArea;
}

export const ConfigurationSummary = ({
  accessLevelType,
  accessLevelMsg,
  noAccess,
  children,
  noAccessMsg,
  productArea
}: ConfigurationSummaryProps) => {
  const getBadgeByProductArea = () => {
    if (syntheticMultiAppEnabled && productArea === ProductArea.SYNTHETICS) {
      return <PreviewBadge privatePreview />;
    }
    return null;
  };

  return (
    <div>
      <Typography variant="heading-200" component="h2">
        {t('in-settings:permissionScope.permissions')}
      </Typography>
      {noAccess ? (
        <Typography variant="body-regular" component="div">
          {noAccessMsg}
        </Typography>
      ) : (
        <>
          {children}
          <div className={locals.accessLevel}>
            <Label className={locals.label}>
              {t('in-settings:permissionScope.selection', { context: accessLevelType?.toLocaleLowerCase() })}
              {getBadgeByProductArea()}
            </Label>
            <Typography variant="body-regular" component="div">
              {accessLevelMsg}
            </Typography>
          </div>
        </>
      )}
    </div>
  );
};
