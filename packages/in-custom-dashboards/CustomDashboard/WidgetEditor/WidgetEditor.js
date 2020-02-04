import React, { useState } from 'react';
import { find } from 'lodash';

import AddNewWidgetDialog from 'in-custom-dashboards/CustomDashboard/dialog/AddNewWidgetDialog';
import SlideInView from 'in-new-components/SlideInView';
import { deepCopy } from 'in-services/util/object';

export default function WidgetEditor({ children, config, setConfig }) {
  const [{ editing, widget, version }, setState] = useState({
    editing: false,
    widget: null,
    version: 0
  });

  return (
    <SlideInView
      sliderContent={
        <AddNewWidgetDialog
          /* Force a complete state reset whenever the user interacts with one of the add/edit buttons */
          key={version}
          widget={widget}
          onSave={widget => {
            const newConfig = deepCopy(config);
            if (widget != null) {
              newConfig.widgets = newConfig.widgets.filter(({ id }) => id !== widget.id);
            }
            newConfig.widgets.push(widget);
            stopEditing();
            setConfig(newConfig);
          }}
        />
      }
      slideIn={editing}
      title="Widget Editor"
      onTitleIconClick={stopEditing}
    >
      {children({
        onAddWidget: () => setState({ editing: true, widget: null, version: Date.now() }),
        onEditWidget: id => {
          const widget = find(config.widgets, eachWidget => id === eachWidget.id);
          setState({ editing: true, widget, version: Date.now() });
        },
        onRemoveWidget: id => {
          const newConfig = deepCopy(config);
          newConfig.widgets = newConfig.widgets.filter(widget => id !== widget.id);
          setConfig(newConfig);
        }
      })}
    </SlideInView>
  );

  function stopEditing() {
    setState({
      editing: false,
      widget: null,
      version: Date.now()
    });
  }
}
