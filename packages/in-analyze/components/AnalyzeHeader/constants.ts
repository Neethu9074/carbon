/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

/* eslint-disable no-restricted-imports */
// @ts-expect-error migrate to TS
import { analyzePath as mobileAppAnalyzePath, mobileAppMonitoringPath } from 'in-mobile-apps/navigation/paths';
// @ts-expect-error migrate to TS
import { dataSource as dataSourceTypeMatrixParameter } from 'in-components/Profiling/navigation/matrix';
// @ts-expect-error migrate to TS
import { beaconType as mobileAppBeaconTypeMatrixParameter } from 'in-mobile-apps/navigation/matrix';
// @ts-expect-error migrate to TS
import { beaconType as websiteBeaconTypeMatrixParameter } from 'in-websites/navigation/matrix';
// @ts-expect-error migrate to TS
import { analyzePath as profilingAnalyzePath } from 'in-components/Profiling/navigation/paths';
import { analyzePath as websiteAnalyzePath, websiteMonitoringPath } from 'in-websites/navigation/paths';
import { dataSource as logsDataSourceTypeMatrixParameter } from 'in-logging/navigation/matrix';
import { dataSourceMatrixParameter } from 'in-applications/navigation/matrix';
import { DataSourceMatrix } from 'in-analyze/components/AnalyzeHeader/types';
import { logsPath as logsAnalyzePath } from 'in-logging/navigation/paths';

export const dataSourceSources: DataSourceMatrix[] = [
  {
    matrixPath: dataSourceMatrixParameter.path,
    matrixParam: dataSourceMatrixParameter.name,
    productArea: 'application'
  },
  {
    matrixPath: logsAnalyzePath,
    matrixParam: logsDataSourceTypeMatrixParameter,
    productArea: 'application'
  },
  {
    pathPrefix: websiteMonitoringPath,
    matrixPath: websiteAnalyzePath,
    matrixParam: websiteBeaconTypeMatrixParameter,
    productArea: 'website'
  },
  {
    pathPrefix: mobileAppMonitoringPath,
    matrixPath: mobileAppAnalyzePath,
    matrixParam: mobileAppBeaconTypeMatrixParameter,
    productArea: 'mobileApp'
  },
  {
    matrixPath: profilingAnalyzePath,
    matrixParam: dataSourceTypeMatrixParameter,
    productArea: 'profiles'
  },
  {
    matrixPath: '/explore',
    matrixParam: dataSourceTypeMatrixParameter,
    productArea: 'infrastructure'
  }
];
