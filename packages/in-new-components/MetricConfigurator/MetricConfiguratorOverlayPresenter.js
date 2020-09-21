import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import locals from './MetricConfiguratorOverlayPresenter.mless';

export default function MetricConfiguratorOverlayPresenter({
  form,
  onChange,
  options,
  onSubmit,
  onAddItem,
  onMetricSelect,
  onRemoveItem,
  onSwap
}) {
  return (
    <form className={locals.overlay} onSubmit={onSubmit}>
      <DragDropContext
        onDragEnd={e => {
          if (e.destination) {
            onSwap(e.source.index, e.destination.index);
          }
        }}
      >
        <Droppable droppableId="metric-configuration">
          {provided => (
            <div ref={provided.innerRef}>
              {form.map((metric, i) => (
                <Draggable key={i} draggableId={i} index={i}>
                  {provided => (
                    <div className={locals.metric} ref={provided.innerRef} {...provided.draggableProps}>
                      <Tooltip content="Reorder metrics">
                        <div className={locals.dragHandle} {...provided.dragHandleProps}>
                          <SvgIcon type="lib_menu" />
                        </div>
                      </Tooltip>
                      <Row>
                        <Col xs={5}>
                          {metric.get('metric').map(field => (
                            <FormGroup>
                              <Label
                                htmlFor={`metric-configuration-metric-${i}`}
                                hasError={!field.valid && field.touched}
                              >
                                Metric
                              </Label>
                              <Select
                                id={`metric-configuration-metric-${i}`}
                                value={field.value}
                                onChange={e => onMetricSelect(i, e.target.value)}
                                hasError={!field.valid && field.touched}
                              >
                                <option value="" disabled>
                                  Please Select
                                </option>
                                {options.map(metric => (
                                  <option key={metric.metric} value={metric.metric}>
                                    {metric.label}
                                  </option>
                                ))}
                              </Select>
                              <TouchedMessages field={field} />
                            </FormGroup>
                          ))}
                        </Col>
                        <Col xs={5}>
                          {options.find(option => option.metric === metric.get('metric').value)?.aggregations.length >
                            1 &&
                            metric.get('aggregation').map(field => (
                              <FormGroup>
                                <Label
                                  htmlFor={`metric-configuration-aggregation-${i}`}
                                  hasError={!field.valid && field.touched}
                                >
                                  Aggregation
                                </Label>
                                <Select
                                  id={`metric-configuration-aggregation-${i}`}
                                  value={field.value}
                                  onChange={e =>
                                    onChange([i, 'aggregation'], field =>
                                      field.setValue(e.target.value).setTouched(true)
                                    )
                                  }
                                  hasError={!field.valid && field.touched}
                                >
                                  <option value="" disabled>
                                    Please Select
                                  </option>
                                  {options
                                    .find(option => option.metric === metric.get('metric').value)
                                    .aggregations.map(aggregation => (
                                      <option key={aggregation} value={aggregation}>
                                        {aggregation}
                                      </option>
                                    ))}
                                </Select>
                                <TouchedMessages field={field} />
                              </FormGroup>
                            ))}
                        </Col>
                        <SvgIcon
                          className={locals.removeButton}
                          type="lib_actions_delete"
                          onClick={() => onRemoveItem(i)}
                        />
                      </Row>
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
        className={locals.addButton}
        onClick={() => onAddItem()}
      >
        Add Metric
      </Button>
      <Button kind="primary" type="submit" className={locals.addButton} disabled={!form.hierarchyValid && form.touched}>
        Save
      </Button>
    </form>
  );
}
