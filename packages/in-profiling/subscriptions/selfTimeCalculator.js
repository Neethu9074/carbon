/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const selfTimesMap = new Map();

export function init() {
  selfTimesMap.clear();
}

export function get(id) {
  return selfTimesMap.has(id) ? selfTimesMap.get(id).selfTime : 0;
}

export function calculate(profile) {
  if (selfTimesMap.has(profile.__uid)) {
    return selfTimesMap.get(profile.__uid).profile.percent;
  }

  let selfTime = profile.percent;
  if (profile.children) {
    let childTimes = 0;
    for (let i = 0; i < profile.children.length; i++) {
      childTimes += calculate(profile.children[i]);
    }
    selfTime -= childTimes;
  }

  selfTimesMap.set(profile.__uid, { profile, selfTime: selfTime / 100 });
  return profile.percent;
}
