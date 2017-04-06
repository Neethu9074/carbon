import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'page.err',
  category: 'eum',
  serviceSideForOverview: 'source',

  showSelfTime: false,

  typeName: {
    singular: 'Page Error',
    plural: 'Page Errors'
  },

  detailView: 'PageErrorSpanDetailView',

  getLabel(span) {
    const message = span.getIn(['data', 'pageErr', 'error', 'message']);
    if (message) {
      return message;
    }

    const url = span.getIn(['data', 'pageErr', 'url']);
    if (url) {
      return `Error on ${url}`;
    }

    return null;
  }
});
