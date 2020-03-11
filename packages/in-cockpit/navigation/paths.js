import { getModifiedUrlStream } from 'in-stores/navigation/navigation';

export const cockpit = '/home';

export const cockpitLink$ = getModifiedUrlStream(params => {
  params.pathname = cockpit;
});
