import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { useState } from 'react';
import classNames from 'classnames';

import { getMetricId, getMetricLabel, getShortMetricKey } from 'in-custom-dashboards/widgets/Chart/util';
import ColorConfigurator from 'in-custom-dashboards/widgets/Chart/FormComponent/ColorConfigurator';
import { renderer as availableRenderers } from 'in-custom-dashboards/widgets/Chart/renderer';
import { toInteractiveElement } from 'in-new-components/interactiveCustomElement';
import { triggerHighlight } from 'in-new-components/SelectedElementHighlighter';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Sections from 'in-new-components/workspace/Sections';
import { barOverlapping } from 'in-stores/metric/renderer';
import { formatters } from 'in-stores/metric/formatters';
import Header from 'in-new-components/workspace/Header';
import FormGroup from 'in-components/form/FormGroup';
import Stack from 'in-new-components/layout/Stack';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';

import locals from './AxesConfigurator.mless';

export const columnDefinitions = [
  {
    forceMinimumWidth: true,
    verticallyCenter: true,
    shrink: false,
    getContent({ dragHandleProps }) {
      return (
        <div className={locals.dragHandleWrapper} {...dragHandleProps}>
          <SvgIcon className={locals.dragHandle} type="lib_actions_reorder" />
        </div>
      );
    }
  },
  {
    forceMinimumWidth: true,
    verticallyCenter: true,
    shrink: false,
    getContent({ index, axisName, indexInAxis }) {
      return (
        <Pill
          kind="info"
          {...toInteractiveElement({
            onDefaultInteraction: () => triggerHighlight(getMetricId(index)),
            ariaLabel: 'Jump to configuration of this dataset'
          })}
          className={locals.pill}
        >
          {getShortMetricKey(axisName, indexInAxis)}
        </Pill>
      );
    }
  },
  {
    getContent({ metricForm }) {
      let title = getMetricLabel(metricForm.toJS());
      if (metricForm.get('timeShift').value !== 0) {
        title = (
          <Tooltip content="Dataset is time shifted">
            <span className={locals.timeShifted}>
              {title} <SvgIcon className={locals.timeShiftIndicator} size="xs" type="lib_datetime_time" />
            </span>
          </Tooltip>
        );
      }

      return <div className={locals.title}>{title}</div>;
    }
  },
  {
    forceMinimumWidth: true,
    verticallyCenter: true,
    shrink: false,
    getContent(args) {
      return <ColorConfigurator {...args} />;
    }
  }
];

export default function AxesConfigurator({ form, onChange }) {
  const [showSecondaryAxis, setShowSecondaryAxis] = useState(form.getIn(['y2', 'metrics']).size > 0);

  return (
    <DragDropContext
      onDragEnd={e => {
        if (!e.destination) {
          return;
        }
        onChange([], form => {
          const metric = form.getIn([e.source.droppableId, 'metrics', e.source.index]);
          return form
            .updateIn([e.source.droppableId, 'metrics'], f => f.remove(e.source.index).setTouched(true))
            .updateIn([e.destination.droppableId, 'metrics'], f =>
              f.insert(e.destination.index, metric).setTouched(true)
            );
        });
      }}
    >
      <div
        className={classNames(locals.wrapper, {
          [locals.dualAxis]: showSecondaryAxis
        })}
      >
        <AxisConfigurator
          showSecondaryAxis={showSecondaryAxis}
          setShowSecondaryAxis={setShowSecondaryAxis}
          form={form}
          onChange={onChange}
          axisName="y1"
          title="Primary Y-Axis"
          startIndex={0}
        />

        {showSecondaryAxis && (
          <AxisConfigurator
            showSecondaryAxis={showSecondaryAxis}
            form={form}
            onChange={onChange}
            axisName="y2"
            title="Secondary Y-Axis"
            startIndex={form.getIn(['y1', 'metrics']).size}
          />
        )}
      </div>
    </DragDropContext>
  );
}

function AxisConfigurator({ showSecondaryAxis, setShowSecondaryAxis, form, onChange, axisName, title, startIndex }) {
  const axisForm = form.get(axisName);
  const metricsForm = axisForm.get('metrics');

  return (
    <Ul className={locals.axis}>
      <Li>
        {title}

        <TouchedMessages field={axisForm} />
      </Li>

      <Li forceAlternateBg className={locals.listItem}>
        <Stack space="medium">
          <Sections>
            {axisForm.get('renderer').map(field => (
              <SelectInSection
                id={`axis-${axisName}-renderer`}
                label="Chart"
                value={field.value}
                onChange={e =>
                  onChange([axisName, 'renderer'], field => field.setValue(e.target.value).setTouched(true))
                }
                hasError={!field.valid && field.touched}
                additionalContent={<TouchedMessages field={field} />}
              >
                {// hide the bar overlapping chart type, which is not very intuitive to understand
                availableRenderers
                  .filter(r => r.id !== barOverlapping.id)
                  .map(({ id, label }) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
              </SelectInSection>
            ))}

            {axisForm.get('formatter').map(field => (
              <SelectInSection
                id={`axis-${axisName}-formatter`}
                label="Formatter"
                value={field.value}
                onChange={e =>
                  onChange([axisName, 'formatter'], field => field.setValue(e.target.value).setTouched(true))
                }
                hasError={!field.valid && field.touched}
                additionalContent={<TouchedMessages field={field} />}
              >
                {formatters.map(({ id, label }) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </SelectInSection>
            ))}

            <Li noAlternatingBg className={locals.minMax} component="div">
              {axisForm.get('min').map(field => (
                <FormGroup className={locals.minMaxGroup}>
                  <Label htmlFor={`${axisName}-chart-configurator-min`} hasError={!field.valid && field.touched}>
                    Min
                  </Label>
                  <Input
                    id={`${axisName}-chart-configurator-min`}
                    value={field.value || ''}
                    type="number"
                    placeholder="Auto"
                    onChange={e =>
                      onChange([axisName, 'min'], field =>
                        field
                          .setValue(e.target.value.length !== 0 ? Number(e.target.value) : undefined)
                          .setTouched(true)
                      )
                    }
                    hasError={!field.valid && field.touched}
                  />
                  <TouchedMessages field={field} />
                </FormGroup>
              ))}

              {axisForm.get('max').map(field => (
                <FormGroup className={locals.minMaxGroup}>
                  <Label htmlFor={`${axisName}-chart-configurator-max`} hasError={!field.valid && field.touched}>
                    Max
                  </Label>
                  <Input
                    id={`${axisName}-chart-configurator-max`}
                    value={field.value || ''}
                    type="number"
                    placeholder="Auto"
                    onChange={e =>
                      onChange([axisName, 'max'], field =>
                        field
                          .setValue(e.target.value.length !== 0 ? Number(e.target.value) : undefined)
                          .setTouched(true)
                      )
                    }
                    hasError={!field.valid && field.touched}
                  />
                  <TouchedMessages field={field} />
                </FormGroup>
              ))}
            </Li>
          </Sections>

          <Stack space="normal">
            <Header>Metrics</Header>

            <TouchedMessages field={metricsForm} />

            <Droppable droppableId={axisName}>
              {provided => (
                <Stack space="xxsmall" ref={provided.innerRef}>
                  {metricsForm.map((metricForm, indexInAxis) => (
                    <Draggable key={indexInAxis} draggableId={startIndex + indexInAxis} index={indexInAxis}>
                      {provided => (
                        <Ul ref={provided.innerRef} {...provided.draggableProps}>
                          <Li noAlternatingBg>
                            <ColumnizedContent
                              columnDefinitions={columnDefinitions}
                              axisName={axisName}
                              metricForm={metricForm}
                              form={form}
                              onChange={onChange}
                              indexInAxis={indexInAxis}
                              index={startIndex + indexInAxis}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </Li>
                        </Ul>
                      )}
                    </Draggable>
                  ))}

                  {metricsForm.size === 0 && (
                    <p className={locals.dragAndDropHelpText}>Drag and drop metrics between the two axes</p>
                  )}
                </Stack>
              )}
            </Droppable>
          </Stack>
        </Stack>
      </Li>

      {!showSecondaryAxis && (
        <Li>
          <Button kind="action" icon="lib_openclose_add_circle_outline" onClick={() => setShowSecondaryAxis(true)}>
            Add secondary Y-axis
          </Button>
        </Li>
      )}
    </Ul>
  );
}
