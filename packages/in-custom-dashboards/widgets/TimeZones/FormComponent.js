import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { useMemo } from 'react';

import { createTimeZoneSubForm } from 'in-custom-dashboards/widgets/TimeZones/form';
import TouchedMessages from 'in-components/form/TouchedMessages';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import { Row, Col } from 'in-new-components/layout/Grid';
import Header from 'in-new-components/workspace/Header';
import FormGroup from 'in-components/form/FormGroup';
import Stack from 'in-new-components/layout/Stack';
import moment from 'in-services/moment-timezone';
import Select from 'in-components/form/Select';
import Button from 'in-new-components/Button';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import locals from './FormComponent.mless';

export default function TimeZoneWidgetFormComponent({
  form: timeZonesForm,
  onChange,
  widgetTitleFormGroup,
  widgetPreview
}) {
  const supportedTimeZones = useMemo(() => moment.tz.names().filter(isSupportedTimeZone));

  return (
    <Stack space="large">
      <StackItem>
        <Header>Customize the Widget</Header>
        {widgetTitleFormGroup}
      </StackItem>

      <StackItem>
        <Header>What would you like to show?</Header>
        <TouchedMessages field={timeZonesForm} />

        <DragDropContext
          onDragEnd={e => {
            if (e.destination) {
              onChange([], form => {
                const timeZone = form.get(e.source.index);
                return form.remove(e.source.index).insert(e.destination.index, timeZone);
              });
            }
          }}
        >
          <Droppable droppableId="timeZones-widget-configuration">
            {provided => (
              <div ref={provided.innerRef}>
                {timeZonesForm.map((timeZoneform, i) => (
                  <Draggable key={i} draggableId={i} index={i}>
                    {provided => (
                      <div className={locals.timeZone} ref={provided.innerRef} {...provided.draggableProps}>
                        <Tooltip content="Reorder time zones">
                          <div className={locals.dragHandle} {...provided.dragHandleProps}>
                            <SvgIcon type="lib_menu" />
                          </div>
                        </Tooltip>
                        <Row>
                          <Col md={6}>
                            {timeZoneform.get('timeZone').map(field => (
                              <FormGroup>
                                <Label
                                  htmlFor={`timeZones-widget-timeZone-${i}`}
                                  hasError={!field.valid && field.touched}
                                >
                                  Time Zone
                                </Label>
                                <Select
                                  id={`timeZones-widget-timeZone-${i}`}
                                  value={field.value}
                                  onChange={e =>
                                    onChange([i, 'timeZone'], field => field.setValue(e.target.value).setTouched(true))
                                  }
                                  hasError={!field.valid && field.touched}
                                >
                                  {supportedTimeZones.map(name => (
                                    <option key={name} value={name}>
                                      {name}
                                    </option>
                                  ))}
                                </Select>
                                <TouchedMessages field={field} />
                              </FormGroup>
                            ))}
                          </Col>

                          <Col md={6}>
                            {timeZoneform.get('label').map(field => (
                              <FormGroup>
                                <Label htmlFor={`timeZones-widget-label-${i}`} hasError={!field.valid && field.touched}>
                                  Label
                                </Label>
                                <Input
                                  id={`timeZones-widget-label-${i}`}
                                  type="text"
                                  value={field.value}
                                  onChange={e =>
                                    onChange([i, 'label'], field => field.setValue(e.target.value).setTouched(true))
                                  }
                                  hasError={!field.valid && field.touched}
                                />
                                <TouchedMessages field={field} />
                              </FormGroup>
                            ))}
                          </Col>
                        </Row>

                        <SvgIcon
                          className={locals.removeButton}
                          type="lib_actions_delete"
                          onClick={() => onChange([], form => form.remove(i).setTouched(true))}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <Button
          kind="secondary"
          icon="lib_openclose_add"
          type="button"
          onClick={() => onChange([], form => form.push(createTimeZoneSubForm()).setTouched(true))}
          className={locals.addButton}
        >
          Add Time Zone
        </Button>
      </StackItem>

      <StackItem>
        <Header>Widget Preview</Header>
        {widgetPreview}
      </StackItem>
    </Stack>
  );
}

function isSupportedTimeZone(timeZone) {
  try {
    new Intl.DateTimeFormat('de-de', {
      timeZone,
      hour12: false,
      hour: 'numeric',
      minute: 'numeric'
    });
    return true;
  } catch (e) {
    return false;
  }
}
