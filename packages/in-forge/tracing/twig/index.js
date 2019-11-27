import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'twig',
  category: 'generic',
  direction: 'local',

  typeName: {
    singular: 'Twig',
    plural: 'Twigs'
  },

  detailView: 'TwigSpanDetailView',

  getLabel(span) {
    const template = span.getIn(['data', 'twig', 'template']);
    if (template) {
      return 'Render Twig template: ' + template.split("/").pop();
    }
    return 'Render Twig template';
  }
});
