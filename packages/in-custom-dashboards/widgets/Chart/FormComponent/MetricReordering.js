/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React from 'react';

import { ColumnizedContent, Ul, Li } from '@instana/components';
import { toInteractiveElement } from '@instana/components';
import { SvgIcon } from '@instana/components';

import ColorConfigurator from 'in-custom-dashboards/widgets/Chart/FormComponent/ColorConfigurator';
import { getMetricId, getMetricLabel } from 'in-custom-dashboards/widgets/Chart/util';
import { triggerHighlight } from 'in-new-components/SelectedElementHighlighter';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { generateStableHash } from 'in-services/util/id';
import Header from 'in-new-components/workspace/Header';
import Stack from 'in-new-components/layout/Stack';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';
import { t } from 'in-i18n';

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
              // Note: react beautiful dnd requires keys to be stable or at least stable while dragging.
              // Usage of indexInAxis is therefore not sufficient. You can validate this by trying to drag
              // the first (and only) metric for a y2 axis.
              <Draggable
                key={generateStableHash(metricForm.toJS())}
                draggableId={String(startIndex + indexInAxis)}
                index={indexInAxis}
              >
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
