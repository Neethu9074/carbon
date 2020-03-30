import React from 'react';

import LocallyChangedTheme from 'in-themes/LocallyChangedTheme';
import widgets from 'in-custom-dashboards/widgets';
import Button from 'in-new-components/Button';
import { lightV2 } from 'in-themes/themes';

import locals from './WidgetPreview.mless';

export default function WidgetPreview({ form, onChange }) {
  if (!form.hierarchyValid) {
    return (
      <p className={locals.invalidConfig}>
        Preview not available because the widget configuration is incomplete.
        <Button className={locals.button} onClick={() => onChange([], f => f.setTouched(true, { recurse: true }))}>
          Highlight missing configuration
        </Button>
      </p>
    );
  }

  const widget = widgets[form.get('type').value];
  const config = form.get('config').toJS();
  return (
    <div className={locals.preview}>
      <LocallyChangedTheme theme={lightV2}>
        <widget.Widget title={form.get('title').value} config={config} isPreview />
      </LocallyChangedTheme>
    </div>
  );
}
