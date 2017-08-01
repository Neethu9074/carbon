import { createStore } from 'in-stores/store';

let routes = [];

const store = createStore({
  name: 'navigation/routes',
  initialValue: routes
});

export function addRoute(path, windowTitle) {
  routes.push({
    link: path,
    title: windowTitle
  });
  store.mutateTo(routes);
}

export function removeRoute(windowTitle) {
  const title = windowTitle;
  routes = routes.filter(route => route.title !== title);
  store.mutateTo(routes);
}

export const routes$ = store.observable;
