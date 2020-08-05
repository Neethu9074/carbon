import React from 'react';

import { Widget, demo } from 'in-custom-dashboards/widgets/Slo';

export default {
  title: 'Templates|CustomDashboard/widgets/Slo',
  component: Widget
};

export function Empty() {
  return <Widget />;
}

export function Demo() {
  return <Widget title="Demo" config={demo} customHeight={200} />;
}

export function Preview() {
  return <Widget title="Preview story" config={demo} customHeight={120} isPreview />;
}
