/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import * as resourceLoad from 'in-websites/analyze/AnalyzeView/Beacons/perBeaconTypeConfigs/resourceLoad';
import * as httpRequest from 'in-websites/analyze/AnalyzeView/Beacons/perBeaconTypeConfigs/httpRequest';
import * as pageChange from 'in-websites/analyze/AnalyzeView/Beacons/perBeaconTypeConfigs/pageChange';
import * as pageLoad from 'in-websites/analyze/AnalyzeView/Beacons/perBeaconTypeConfigs/pageLoad';
import * as custom from 'in-websites/analyze/AnalyzeView/Beacons/perBeaconTypeConfigs/custom';
import * as error from 'in-websites/analyze/AnalyzeView/Beacons/perBeaconTypeConfigs/error';

export default {
  pageLoad,
  pageChange,
  resourceLoad,
  httpRequest,
  error,
  custom
};
