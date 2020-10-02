import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { useState } from 'react';

import PaginatedMetricList from 'in-new-components/MetricConfigurator/PaginatedMetricList';
import SlideInView, { ListHeader } from 'in-new-components/SlideInView/SlideInView';
import { evaluateClassNames } from 'in-services/util/classnames';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import { Col } from 'in-new-components/layout/Grid';
import { shorten } from 'in-services/util/string';
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
  maximumNumberOfMetrics,
  onAddItem,
  onRemoveItem,
  onSwap,
  getPossibleAggregationsForMetric
}) {
  const [showSlideInContent, onShowSlideInContentChange] = useState(false);

  return (
    <SlideInView
      staticContent={
        <form
          className={evaluateClassNames({
            [locals.overlay]: true,
            [locals.fullHeight]: showSlideInContent
          })}
        >
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
                              <SvgIcon type="lib_menu" size="xs" />
                            </div>
                          </Tooltip>
                          {getAllAggregationsOfMetric(metric.get('metric').value).length > 1 ? (
                            <>
                              <Col xs={5}>
                                {metric.get('metric').map(field => (
                                  <Label
                                    htmlFor={`metric-configuration-metric-${i}`}
                                    hasError={!field.valid && field.touched}
                                    className={locals.label}
                                  >
                                    {shorten(options.find(opt => opt.metric === field.value).label, 18)}
                                  </Label>
                                ))}
                              </Col>

                              {metric.get('aggregation').map(field => (
                                <Col xs={5}>
                                  <FormGroup>
                                    <Select
                                      id={`metric-configuration-aggregation-${i}`}
                                      value={field.value}
                                      onChange={e =>
                                        onChange([i, 'aggregation'], field =>
                                          field.setValue(e.target.value).setTouched(true)
                                        )
                                      }
                                      className={locals.aggregations}
                                      hasError={!field.valid && field.touched}
                                    >
                                      <option value="" disabled>
                                        Please Select
                                      </option>
                                      {options
                                        .find(option => option.metric === metric.get('metric').value)
                                        .aggregations.map(aggregation => (
                                          <option
                                            key={aggregation}
                                            value={aggregation}
                                            disabled={
                                              !getPossibleAggregationsForMetric(metric.get('metric').value).includes(
                                                aggregation
                                              )
                                            }
                                          >
                                            {aggregation}
                                          </option>
                                        ))}
                                    </Select>
                                    <TouchedMessages field={field} />
                                  </FormGroup>
                                </Col>
                              ))}
                            </>
                          ) : (
                            <Col xs={10}>
                              {metric.get('metric').map(field => (
                                <Label
                                  htmlFor={`metric-configuration-metric-${i}`}
                                  hasError={!field.valid && field.touched}
                                  className={locals.label}
                                >
                                  {options.find(opt => opt.metric === field.value).label}
                                </Label>
                              ))}
                            </Col>
                          )}
                          <SvgIcon
                            className={locals.removeButton}
                            type="lib_actions_delete"
                            onClick={() => onRemoveItem(i)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div className={locals.addButtonContainer}>
            <Button
              kind="action"
              onClick={() => onShowSlideInContentChange(!showSlideInContent)}
              icon="lib_openclose_add_circle_outline"
              className={locals.addButton}
              disabled={form.items.length === maximumNumberOfMetrics}
            >
              Add a metric
            </Button>
          </div>
        </form>
      }
      HeaderComponent={ListHeader}
      slideTransitionDurationMillis={250}
      onAfterSlideOut={() => {
        return;
      }} // do nothing
      slideInContent={
        <PaginatedMetricList
          form={form}
          options={options}
          isMetricDisabled={metric => isMetricDisabled(metric)}
          onChange={node => {
            onAddItem(node.metric);
            onShowSlideInContentChange(false);
          }}
        />
      }
      slideInContentTitle="Add a metric"
      showSlideInContent={showSlideInContent}
      onShowSlideInContentChange={onShowSlideInContentChange}
    />
  );

  function getAllAggregationsOfMetric(metric) {
    return options.find(option => option.metric === metric).aggregations;
  }

  function isMetricDisabled(metric) {
    const items = form.items;
    if (items.length === 0) {
      return false;
    }

    return getPossibleAggregationsForMetric(metric).length === 0;
  }
}
