/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const selfTimeThreshold = 0.05;

import { buildJsonSerializer } from 'in-stores/navigation/matrix';

export function getTopSelfTimeList(profile) {
  const allProfilesWithSelfTimes = getProfilesAsList(profile.profileGraph).filter(({ selfTime }) => selfTime > 0);
  const sortedProfilesWithSelfTimes = allProfilesWithSelfTimes.slice().sort((p1, p2) => p2.selfTime - p1.selfTime);
  const filteredProfiles = sortedProfilesWithSelfTimes.filter(({ selfTime }) => selfTime > selfTimeThreshold);
  // we want to show only self times > threshold but at least 5 items
  const enrichedProfilesWithSelfTimes = filteredProfiles.concat(
    sortedProfilesWithSelfTimes.slice(filteredProfiles.length, 5)
  );

  return { enrichedProfilesWithSelfTimes, allProfilesWithSelfTimes };
}

function getProfilesAsList(profileGraph) {
  const allProfiles = [];
  profileGraph.forEach(p => add(p, allProfiles));
  return allProfiles;
}

function add(profile, list) {
  list.push(profile);
  if (profile.children) {
    for (const child of profile.children) {
      add(child, list);
    }
  }
}

export function createProfileSignature(profile) {
  return buildJsonSerializer()({
    fileLine: profile.fileLine,
    fileName: profile.fileName,
    methodName: profile.methodName
  });
}
