import { role } from 'in-stores/user';
import Resources from './Resources';
import Summary from './Summary';
import Config from './Config';
import Errors from './Errors';
import Pages from './Pages';
import Transitions from './Transitions';
import Speed from './Speed';
import AJAX from './AJAX';

export function getTabs(snapshot, pageHash) {
  const isNonServiceMappedWebsite = snapshot.getIn(['data', 'eumKey']) === snapshot.getIn(['data', 'steady_id']);
  const pathPrefix = pageHash ? `/pages/${pageHash}` : '';
  const spaEnabled = snapshot.getIn(['data', 'spaEnabled']);
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
      : null,
    pageHash == null && spaEnabled
      ? {
          label: 'Transitions',
          path: `${pathPrefix}/transitions`,
          component: Transitions
        }
      : null,
    pageHash == null && isNonServiceMappedWebsite && role.canConfigureEumApplications
      ? {
          label: 'Configuration',
          path: `${pathPrefix}/config`,
          component: Config
        }
      : null
  ].filter(tab => tab != null);
}
