/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useCallback } from 'react';

import { GeoDetailRemoval, Result } from '@instana/types';
import { just, Observable } from '@instana/observables';

import GeoDetailRemovalForm from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/GeoDetailRemoval';
import { getGeoLocationConfiguration, updateGeoLocationConfiguration } from 'in-websites/api/websites';

export interface Props {
  websiteId: string;
}

export default function WebsiteIpMasking({ websiteId }: Props) {
  const get = useCallback<(v: void) => Observable<Result<GeoDetailRemoval>>>(
    () =>
      getGeoLocationConfiguration(websiteId).map<Result<GeoDetailRemoval>>(result => {
        if (result.data) {
          return {
            ...result,
            data: result.data.geoDetailRemoval
          };
        }
        return result as unknown as Result<GeoDetailRemoval>;
      }),
    [websiteId]
  );
  const set = useCallback<(geoDetailRemoval: GeoDetailRemoval) => Observable<Result<GeoDetailRemoval>>>(
    geoDetailRemoval =>
      getGeoLocationConfiguration(websiteId)
        .filter(result => !result.progress.loading)
        // Get the latest state so that we can just update the detail removal setting
        .map(result => {
          if (result.data) {
            return {
              ...result,
              data: {
                ...result.data,
                geoDetailRemoval
              }
            };
          }
          return result;
        })
        .flatMap(result => {
          if (!result.data) {
            return just(result as unknown as Result<GeoDetailRemoval>);
          }

          return updateGeoLocationConfiguration(websiteId, result.data).map(result => {
            if (result.data) {
              return {
                ...result,
                data: geoDetailRemoval
              };
            }
            return result as unknown as Result<GeoDetailRemoval>;
          });
        }),
    [websiteId]
  );
  return <GeoDetailRemovalForm get={get} set={set} />;
}
