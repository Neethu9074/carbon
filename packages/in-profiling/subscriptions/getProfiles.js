import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getProfiles',
  disposeSubscriptionOnDocumentHidden: false,
  mapResult
});

function mapResult(result) {
  if (!result.data) {
    return result;
  }

  const newResult = { errors: result.errors, progress: result.progress, data: {} };
  if (result.data.cpuProfile) {
    newResult.data.cpuProfile = {
      ...result.data.cpuProfile,
      __uid: getId(),
      profileGraph: result.data.cpuProfile.profileGraph.map(enhanceProfile)
    };
  }
  if (result.data.memoryProfile) {
    newResult.data.memoryProfile = {
      ...result.data.memoryProfile,
      __uid: getId(),
      profileGraph: result.data.memoryProfile.profileGraph.map(enhanceProfile)
    };
  }
  if (result.data.timeProfile) {
    newResult.data.timeProfile = {
      ...result.data.timeProfile,
      __uid: getId(),
      profileGraph: result.data.timeProfile.profileGraph.map(enhanceProfile)
    };
  }
  return newResult;
}

function enhanceProfile(profile, parentNode = null) {
  profile = {
    ...profile,
    __uid: getId(),
    parentNode,
    children: profile.children.map(enhanceProfile, profile)
  };

  return profile;
}

let id = 1;
function getId() {
  return id++;
}
