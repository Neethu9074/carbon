import {createStore} from 'in-stores/store';


const isLoading = createStore({
  name: 'globeview/isLoadingStore',
  initialValue: true
});
export const isLoading$ = isLoading.observable;

const loadingResources = createStore({
  name: 'globeview/loadingResources',
  initialValue: {
    isLoading,
    resources: {
      globeDiffuseMap: true,
      globeSpecularMap: true,
      globeNormalMap: true,
      cloudAlphaMap: true,
      starMap: true,
      globeEffectOverlayMap: true,
      globeEffectOuterGlowMap: true
    }
  }
});
export const loadingResources$ = loadingResources.observable;

export function resourceLoaded(name) {
  loadingResources.applyStateMutation(loadingResources => {
    loadingResources.resources[name] = false;

    const keys = Object.keys(loadingResources.resources);
    loadingResources.isLoading = false;
    for (let i = 0; i < keys.length; i++) {
      if (loadingResources.resources[keys[i]]) {
        loadingResources.isLoading = true;
      }
    }

    return loadingResources;
  });
}
