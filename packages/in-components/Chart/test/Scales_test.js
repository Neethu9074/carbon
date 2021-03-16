/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */
import proxyquire from 'proxyquire';
import { expect } from 'chai';

import { calculateAxisMinMax } from 'in-components/Chart/Scales';
import { number } from 'in-services/formatters/number';

describe('in-components/Chart/Scales', () => {
  let Scales;

  beforeEach(() => {
    Scales = proxyquire('in-components/Chart/Scales', {}).default;
  });

  describe('constuctor', () => {
    it('should only create scale for y2 if y2 axis is defined', () => {
      let scales = new Scales({});
      expect(scales.y1).not.to.equal(undefined);
      expect(scales.y2).to.equal(undefined);

      scales = new Scales({ y2: {} });
      expect(scales.y1).not.to.equal(undefined);
      expect(scales.y2).not.to.equal(undefined);
    });
  });

  describe('update', () => {
    it('should update axis according to the given config', () => {
      const scales = new Scales({
        y1: { formatter: [number] },
        y2: {
          labels: ['a'],
          metrics: [
            [
              [0, 1],
              [1000, 20]
            ]
          ],
          formatter: [number]
        },
        timeConfig: { windowSize: 20000, to: 60000 },
        backBufferWidth: 100,
        height: 50,
        timeAxisHeight: 0,
        markerPaneHeight: 0
      });
      scales.update();

      expect(scales.y1.getRangeFrom()).to.equal(50);
      expect(scales.y1.getRangeTo()).to.equal(0);

      expect(scales.y2.getRangeFrom()).to.equal(50);
      expect(scales.y2.getRangeTo()).to.equal(0);
    });

    it('should take all metric series into account when calculating metrics', () => {
      const scales = new Scales({
        y1: {
          labels: ['a', 'b'],
          metrics: [
            [
              [0, 1],
              [1000, 20]
            ], // series 1
            [
              [0, -1],
              [1000, 0]
            ] // series 2
          ],
          formatter: [number]
        },
        y2: {
          labels: ['a', 'b'],
          metrics: [
            [
              [0, 1],
              [1000, 20]
            ], // series 1
            [
              [0, 4],
              [1000, 10]
            ] // series 2
          ],
          formatter: [number]
        },
        timeConfig: { windowSize: 20000, to: 60000 },
        backBufferWidth: 100,
        height: 50,
        timeAxisHeight: 0,
        markerPaneHeight: 0
      });
      scales.update();

      expect(scales.y1.getDomainFrom()).to.equal(0);
      expect(scales.y1.getDomainTo()).to.equal(20);

      expect(scales.y2.getDomainFrom()).to.equal(0);
      expect(scales.y2.getDomainTo()).to.equal(20);
    });

    it('should update tick positions on update', () => {
      const scales = new Scales({
        y1: {
          formatter: [number],
          metrics: [
            [
              [0, 1],
              [1000, 20]
            ], // series 1
            [
              [0, 4],
              [1000, 10]
            ] // series 2
          ]
        },
        timeConfig: { windowSize: 20000, to: 60000 },
        backBufferWidth: 100,
        height: 50,
        timeAxisHeight: 0,
        markerPaneHeight: 0
      });

      expect(scales.y1.tickPositions).to.equal(undefined);
      scales.update();
      expect(scales.y1.tickPositions).to.deep.equal([
        {
          domain: 0,
          range: 50
        },
        {
          domain: 5,
          range: 37.5
        },
        {
          domain: 10,
          range: 25
        },
        {
          domain: 15,
          range: 12.5
        },
        {
          domain: 20,
          range: 0
        }
      ]);
    });
  });

  describe('calculateAxisMinMax', () => {
    it('should use the axis max value if defined', () => {
      const axis = {
        metrics: [
          [
            [0, 0],
            [10, 1000]
          ]
        ],
        labels: ['Metric1'],
        max: 42
      };
      calculateAxisMinMax('y1', axis, new Map());
      expect(axis.maxValue).to.equal(42);
    });

    it('should use 0 as min and 1 as max for empty axis', () => {
      const axis = {
        metrics: [[], []],
        labels: ['M1', 'M2']
      };
      calculateAxisMinMax('y1', axis, new Map());
      expect(axis.minValue).to.equal(0);
      expect(axis.maxValue).to.equal(1);
    });

    it('should use 0 as min and 1 as max for max = 0', () => {
      const axis = {
        metrics: [[[0, 0]], [[0, 0]]],
        labels: ['M1', 'M2']
      };
      calculateAxisMinMax('y1', axis, new Map());
      expect(axis.minValue).to.equal(0);
      expect(axis.maxValue).to.equal(1);
    });

    it('should find the max values on all series', () => {
      const axis = {
        metrics: [
          [
            [0, 1],
            [0, 10],
            [0, 9],
            [0, 3]
          ],
          [
            [0, -1],
            [0, 2],
            [0, 11],
            [0, 0]
          ]
        ],
        labels: ['M1', 'M2']
      };
      calculateAxisMinMax('y1', axis, new Map());
      expect(axis.minValue).to.equal(0);
      expect(axis.maxValue).to.equal(11);
    });

    it('should ignore filtered series', () => {
      const axis = {
        metrics: [
          [
            [0, 1],
            [0, 10],
            [0, 9],
            [0, 3]
          ],
          [
            [0, -1],
            [0, 2],
            [0, 11],
            [0, 0]
          ]
        ],
        labels: ['M1', 'M2']
      };
      calculateAxisMinMax('y1', axis, new Map([['y1-1', true]]));
      expect(axis.minValue).to.equal(0);
      expect(axis.maxValue).to.equal(10);
    });

    it('should find the local max value', () => {
      const axis = {
        metrics: [
          [
            [0, 1],
            [10, 9],
            [20, 10],
            [30, 3]
          ],
          [
            [0, -1],
            [10, 12],
            [30, 0]
          ]
        ],
        labels: ['M1', 'M2'],
        valuesDependOnEachOther: true
      };
      calculateAxisMinMax('y1', axis, new Map());
      expect(axis.minValue).to.equal(0);
      expect(axis.maxValue).to.equal(12);
    });

    it('should find the local max value for stacked axis', () => {
      const axis = {
        metrics: [
          [
            [0, 1],
            [10, 9],
            [20, 10],
            [30, 3]
          ],
          [
            [0, -1],
            [10, 12],
            [30, 0]
          ]
        ],
        labels: ['M1', 'M2'],
        valuesDependOnEachOther: true,
        valuesNeedToBeStacked: true
      };
      calculateAxisMinMax('y1', axis, new Map());
      expect(axis.minValue).to.equal(0);
      expect(axis.maxValue).to.equal(21);
    });

    describe('calculateStackDifferences', () => {
      it('should calculate stack differences', () => {
        const axis = {
          metrics: [
            [
              [0, -1],
              [10, 9],
              [20, 10],
              [30, 0]
            ],
            [
              [0, 1],
              [10, 17],
              [20, 11],
              [30, 2]
            ]
          ],
          labels: ['M1', 'M2'],
          valuesDependOnEachOther: true,
          calculateStackDifferences: true
        };
        calculateAxisMinMax('y1', axis, new Map());
        expect(axis.minValue).to.equal(0);
        expect(axis.maxValue).to.equal(17);
      });

      it('should take gaps into acount', () => {
        const axis = {
          metrics: [
            [
              [0, -1],
              [10, 9],
              [20, 101],
              [30, 0]
            ],
            [
              [0, 1],
              [10, 10],
              [30, 3]
            ]
          ],
          labels: ['M1', 'M2'],
          valuesDependOnEachOther: true,
          calculateStackDifferences: true
        };
        calculateAxisMinMax('y1', axis, new Map());
        expect(axis.minValue).to.equal(0);
        expect(axis.maxValue).to.equal(101);
      });
    });
  });
});
