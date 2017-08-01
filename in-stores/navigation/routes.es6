import { createStore } from 'in-stores/store';

let routes = [];

const store = createStore({
  name: 'navigation/routes',
  initialValue: routes
});

export function addRoute(route) {
  routes.push({
    link: route.props.path,
    title: route.props.windowTitle
  });
  store.mutateTo(routes);
}

export function removeRoute(route) {
  const title = route.props.windowTitle;
  routes = routes.filter(route => route.title !== title);
  store.mutateTo(routes);
}

export const routes$ = store.observable;
