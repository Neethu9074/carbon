/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { t } from 'in-i18n';
import React from 'react';

import ColorConfigurator from 'in-custom-dashboards/widgets/Chart/FormComponent/ColorConfigurator';
import { getMetricId, getMetricLabel } from 'in-custom-dashboards/widgets/Chart/util';
import { toInteractiveElement } from 'in-new-components/interactiveCustomElement';
import { triggerHighlight } from 'in-new-components/SelectedElementHighlighter';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Header from 'in-new-components/workspace/Header';
import Stack from 'in-new-components/layout/Stack';
import SvgIcon from 'in-components/SvgIcon';
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
    getContent({ index, axisName, indexInAxis, getShortMetricKey }) {
      return (
        <Pill
          kind="info"
          {...toInteractiveElement({
            onDefaultInteraction: () => triggerHighlight(getMetricId(index)),
            ariaLabel: t('in-custom-dashboards:widgets.formCompChart.metricReorderingChart.jumpConfigDataset')
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
          <Tooltip content={t('in-custom-dashboards:widgets.formCompChart.metricReorderingChart.datasetTimeShift')}>
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

export function Reorderer({ onChange, children }) {
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
      {children}
    </DragDropContext>
  );
}

export function MetricsForAxis({
  form,
  onChange,
  axisName,
  startIndex,
  getShortMetricKey,
  helpText = t('in-custom-dashboards:widgets.formCompChart.metricReorderingChart.dragDropDataset2Axes')
}) {
  const axisForm = form.get(axisName);
  const metricsForm = axisForm.get('metrics');

  const showHelpText = metricsForm.size === 0;

  return (
    <Stack space="normal">
      <Header>{t('in-custom-dashboards:widgets.formCompChart.metricReorderingChart.datasets')}</Header>

      <TouchedMessages field={metricsForm} />

      <Droppable droppableId={axisName}>
        {provided => (
          <Stack space="xxsmall" ref={provided.innerRef}>
            {metricsForm.map((metricForm, indexInAxis) => (
              <Draggable key={indexInAxis} draggableId={String(startIndex + indexInAxis)} index={indexInAxis}>
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
                        getShortMetricKey={getShortMetricKey}
                      />
                    </Li>
                  </Ul>
                )}
              </Draggable>
            ))}

            {showHelpText && <p className={locals.dragAndDropHelpText}>{helpText}</p>}
            {provided.placeholder}
          </Stack>
        )}
      </Droppable>
    </Stack>
  );
}
