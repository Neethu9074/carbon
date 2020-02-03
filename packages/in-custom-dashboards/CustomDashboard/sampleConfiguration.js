import { demo as timeZonesDemo } from 'in-custom-dashboards/widgets/TimeZones';
import { demo as markdownDemo } from 'in-custom-dashboards/widgets/Markdown';
import { generateUniqueShortId } from 'in-services/util/id';

// This sample JSON shows the kind of data structure we are most
// likely going to persist in our data store.

export default {
  title: 'My first custom dashboard',

  widgets: [
    {
      id: generateUniqueShortId(),
      width: 12,
      height: 1,
      x: 0,
      y: 0,
      type: 'timeZones',
      title: 'Some Time Zones',
      config: timeZonesDemo
    },
    {
      id: generateUniqueShortId(),
      width: 4,
      height: 1,
      x: 0,
      y: 1,
      type: 'markdown',
      title: 'Example A',
      config: 'Widget **A**'
    },
    {
      id: generateUniqueShortId(),
      width: 4,
      height: 1,
      x: 4,
      y: 1,
      type: 'markdown',
      title: 'Example B',
      config: 'Widget *B*'
    },
    {
      id: generateUniqueShortId(),
      width: 4,
      height: 1,
      x: 8,
      y: 1,
      type: 'markdown',
      title: 'Example C',
      config: 'Widget `C`'
    },
    {
      id: generateUniqueShortId(),
      width: 6,
      height: 3,
      x: 3,
      y: 3,
      type: 'markdown',
      title: 'Full Markdown Example',
      config: markdownDemo
    }
  ]
};
