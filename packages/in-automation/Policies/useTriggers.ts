/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  EventSpecificationInfo,
  LogAlertConfigWithMetadata,
  Result,
  ServiceLevelsAlertConfigWithMetadata,
  SyntheticAlertConfigWithMetadata
} from '@instana/types';
import { useObservable } from '@instana/hooks';

import {
  getEventSpecifications,
  getApplicationSmartAlertConfigs,
  getWebsiteSmartAlertConfigs,
  getGlobalApplicationSmartAlertConfigs,
  getMobileAppSmartAlertConfigs,
  getInfraSmartAlertConfigs,
  getLogSmartAlertConfigs,
  getSyntheticSmartAlertConfigs,
  getSloSmartAlertConfigs
} from 'in-automation/api';
import {
  ApplicationSmartAlertConfigWithMetadata,
  GlobalApplicationsSmartAlertConfigWithMetadata
} from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { MobileAppSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { WebsiteSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { pendingResult } from 'in-services/fixedObjects';
import { mapData } from 'in-services/util/result';
import { Triggers } from 'in-automation/types';

export default function useTriggers(): Triggers {
  const eventSpecification =
    useObservable(getEventSpecifications, []) ?? (pendingResult as Result<EventSpecificationInfo[]>);
  const applicationSmartAlert =
    useObservable(getApplicationSmartAlertConfigs, []) ??
    (pendingResult as Result<ApplicationSmartAlertConfigWithMetadata[]>);
  const websiteSmartAlert =
    useObservable(getWebsiteSmartAlertConfigs, []) ?? (pendingResult as Result<WebsiteSmartAlertConfigWithMetadata[]>);
  const globalApplicationSmartAlert =
    useObservable(getGlobalApplicationSmartAlertConfigs, []) ??
    (pendingResult as Result<GlobalApplicationsSmartAlertConfigWithMetadata[]>);
  const mobileAppSmartAlert =
    useObservable(getMobileAppSmartAlertConfigs, []) ??
    (pendingResult as Result<MobileAppSmartAlertConfigWithMetadata[]>);
  const infraSmartAlert =
    useObservable(getInfraSmartAlertConfigs, []) ?? (pendingResult as Result<InfraSmartAlertConfigWithMetadata[]>);
  const logSmartAlert =
    useObservable(getLogSmartAlertConfigs, []) ?? (pendingResult as Result<LogAlertConfigWithMetadata[]>);
  const syntheticsSmartAlert = useObservable(getSyntheticSmartAlertConfigs, []) as Result<
    SyntheticAlertConfigWithMetadata[]
  >;
  const sloSmartAlert =
    useObservable(getSloSmartAlertConfigs, []) ?? (pendingResult as Result<ServiceLevelsAlertConfigWithMetadata[]>);

  const customEvent = mapData(eventSpecification, data =>
    data?.reduce<EventSpecificationInfo[]>((specs, eventSpecification) => {
      if (eventSpecification.type === 'CUSTOM') {
        specs.push(eventSpecification);
      }
      return specs;
    }, [])
  );
  const builtinEvent = mapData(eventSpecification, data =>
    data?.reduce<EventSpecificationInfo[]>((specs, eventSpecification) => {
      if (eventSpecification.type === 'BUILT_IN') {
        specs.push(eventSpecification);
      }
      return specs;
    }, [])
  );

  return {
    customEvent,
    builtinEvent,
    applicationSmartAlert,
    websiteSmartAlert,
    globalApplicationSmartAlert,
    mobileAppSmartAlert,
    infraSmartAlert,
    logSmartAlert,
    syntheticsSmartAlert,
    sloSmartAlert
  };
}
