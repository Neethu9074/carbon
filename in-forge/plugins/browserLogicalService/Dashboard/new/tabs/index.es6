import Resources from './Resources';
import Summary from './Summary';
import Errors from './Errors';
import Pages from './Pages';
import Speed from './Speed';
import AJAX from './AJAX';

export const websiteTabs = getTabs();

export function getTabs(pageHash) {
  const pathPrefix = pageHash ? `/pages/${pageHash}` : '';
  return [
    {
      label: 'Summary',
      path: `${pathPrefix}/`,
      component: Summary
    },
    {
      label: 'Speed',
      path: `${pathPrefix}/speed`,
      component: Speed
    },
    pageHash == null
      ? {
          label: 'Resources',
          path: `${pathPrefix}/resources`,
          component: Resources
        }
      : null,
    {
      label: 'Errors',
      path: `${pathPrefix}/errors`,
      component: Errors
    },
    pageHash == null
      ? {
          label: 'AJAX',
          path: `${pathPrefix}/ajax`,
          component: AJAX
        }
      : null,
    pageHash == null
      ? {
          label: 'Pages',
          path: `${pathPrefix}/pages`,
          component: Pages
        }
      : null
  ].filter(tab => tab != null);
}
