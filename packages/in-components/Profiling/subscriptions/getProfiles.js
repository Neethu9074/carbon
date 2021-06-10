/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { init, get, calculate } from 'in-components/Profiling/subscriptions/selfTimeCalculator';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getProfiles',
  disposeSubscriptionOnDocumentHidden: false,
  memoizeFor: 60 * 1000,
  mapResult
});

function mapResult(result) {
  if (!result.data) {
    return result;
  }

  init();
  const newResult = { errors: result.errors, progress: result.progress, data: {} };
  if (result.data.cpuProfile) {
    newResult.data.cpuProfile = {
      ...result.data.cpuProfile,
      __uid: getId(),
      profileGraph: result.data.cpuProfile.profileGraph.map(p => enhanceProfile(p))
    };
  }
  if (result.data.memoryProfile) {
    newResult.data.memoryProfile = {
      ...result.data.memoryProfile,
      __uid: getId(),
      profileGraph: result.data.memoryProfile.profileGraph.map(p => enhanceProfile(p))
    };
  }
  if (result.data.timeProfile) {
    newResult.data.timeProfile = {
      ...result.data.timeProfile,
      __uid: getId(),
      profileGraph: result.data.timeProfile.profileGraph.map(p => enhanceProfile(p))
    };
  }
  return newResult;
}

function enhanceProfile(profile, parentNode = null) {
  const enhancedProfile = {
    ...profile,
    __uid: getId(),
    parentNode
  };
  enhancedProfile.children = profile.children.map(childNode => enhanceProfile(childNode, enhancedProfile));

  calculate(enhancedProfile);
  enhancedProfile.selfTime = get(enhancedProfile.__uid);

  return enhancedProfile;
}

let id = 1;
function getId() {
  return id++;
}
