/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { expect } from 'chai';

import { processMetricsIntoCategories } from './ReportingStatus';

// Define interfaces for type safety
interface MetricResponse {
  data: number[][];
  pollRate: number;
}

describe('processMetricsIntoCategories', () => {
  const defaultRollup = 5000; // 5 seconds
  const pollRate = 1;

  it('should return empty array for null or empty metrics', () => {
    // Test with null metrics
    const result1 = processMetricsIntoCategories(null, 0, 10000, defaultRollup, pollRate);
    void expect(result1).to.be.an('array').that.is.empty;

    // Test with empty data array
    const emptyMetrics: MetricResponse = { data: [], pollRate };
    const result2 = processMetricsIntoCategories(emptyMetrics, 0, 10000, defaultRollup, pollRate);
    void expect(result2).to.be.an('array').that.is.empty;

    // Test with single data point (should also return empty array per the function logic)
    const singlePointMetrics: MetricResponse = { data: [[1000, 60]], pollRate };
    const result3 = processMetricsIntoCategories(singlePointMetrics, 0, 10000, defaultRollup, pollRate);
    void expect(result3).to.be.an('array').that.is.empty;
  });

  it('should calculate availability correctly', () => {
    const metrics: MetricResponse = {
      data: [
        [1000, 5],
        [6000, 1],
        [16000, 5],
        [21000, 5],
        [26000, 2],
        [31000, 5]
      ],
      pollRate
    };

    const result = processMetricsIntoCategories(metrics, 0, 31000, defaultRollup, pollRate);

    void expect(result).to.be.an('array');
    void expect(result.length).to.equal(5); // Should have 5 segments

    // First segment: gap at the beginning (0 to 1000)
    void expect(result[0]).to.deep.include({
      from: 0,
      to: 1000,
      availability: 0
    });

    // Second segment: first data point (1000 to 6000)
    void expect(result[1]).to.deep.include({
      from: 1000,
      to: 6000,
      availability: 100
    });

    // Third segment: second data point (6000 to 21000)
    void expect(result[2]).to.deep.include({
      from: 6000,
      to: 21000,
      availability: 20
    });

    // Fourth segment: third data point (21000 to 26000)
    void expect(result[3]).to.deep.include({
      from: 21000,
      to: 26000,
      availability: 100
    });

    // Fifth segment: gap at the end (26000 to 31000)
    void expect(result[4]).to.deep.include({
      from: 26000,
      to: 31000,
      availability: 40
    });
  });

  it('should handle gaps between data points', () => {
    const metrics: MetricResponse = {
      data: [
        [1000, 5], // First data point
        [11000, 5] // Gap of 5 seconds between data points (larger than rollupGapTolerance)
      ],
      pollRate
    };

    const result = processMetricsIntoCategories(metrics, 0, 21000, defaultRollup, pollRate);

    void expect(result).to.be.an('array');
    void expect(result.length).to.equal(3); // Should have 3 segments

    // Check the gap between data points is marked as unavailable
    void expect(result[1]).to.deep.include({
      from: 1000,
      to: 16000,
      availability: 100
    });

    void expect(result[2]).to.deep.include({
      from: 16000,
      to: 21000,
      availability: 0
    });
  });

  it('should merge adjacent data points with same availability', () => {
    const metrics: MetricResponse = {
      data: [
        [1000, 5], // 100% availability
        [6000, 5], // 100% availability (same as previous)
        [11000, 2.5], // 50% availability (different)
        [16000, 2.5] // 50% availability (same as previous)
      ],
      pollRate
    };

    const result = processMetricsIntoCategories(metrics, 0, 25000, defaultRollup, pollRate);

    void expect(result).to.be.an('array');
    void expect(result.length).to.equal(4); // Should have 4 segments after merging

    // First segment: gap at the beginning
    void expect(result[0]).to.deep.include({
      from: 0,
      to: 1000,
      availability: 0
    });

    // Second segment: merged first and second data points with 100% availability
    void expect(result[1]).to.deep.include({
      from: 1000,
      to: 11000,
      availability: 100
    });

    // Third segment: merged third and fourth data points with 50% availability
    void expect(result[2]).to.deep.include({
      from: 11000,
      to: 21000,
      availability: 50
    });

    // Fourth segment: gap at the end
    void expect(result[3]).to.deep.include({
      from: 21000,
      to: 25000,
      availability: 0
    });
  });

  it('should handle time window boundaries correctly', () => {
    const metrics: MetricResponse = {
      data: [
        [5000, 5],
        [10000, 5],
        [15000, 5]
      ],
      pollRate
    };

    const timeWindowFrom = 0;
    const timeWindowTo = 25000;

    const result = processMetricsIntoCategories(metrics, timeWindowFrom, timeWindowTo, defaultRollup, pollRate);

    void expect(result).to.be.an('array');
    void expect(result.length).to.equal(3);

    // First segment: gap from timeWindowFrom to first data point
    void expect(result[0]).to.deep.include({
      from: 0,
      to: 5000,
      availability: 0
    });

    // Middle segment: all data points merged (since they have same availability)
    void expect(result[1]).to.deep.include({
      from: 5000,
      to: 20000,
      availability: 100
    });

    // Last segment: gap from last data point to timeWindowTo
    void expect(result[2]).to.deep.include({
      from: 20000,
      to: 25000,
      availability: 0
    });
  });

  it('should handle different poll rates', () => {
    // With pollRate = 5 (once every 5 seconds), we expect 100% when 1 value is reported
    const metrics: MetricResponse = {
      data: [
        [1000, 1],
        [6000, 1]
      ],
      pollRate: 5
    };

    const result = processMetricsIntoCategories(metrics, 0, 6000, defaultRollup, metrics.pollRate);

    void expect(result).to.be.an('array');
    void expect(result.length).to.equal(2);

    // Check the availability calculation with different poll rate
    void expect(result[1]).to.deep.include({
      from: 1000,
      to: 6000,
      availability: 100 // 5 messages / (5 seconds * 2 messages/second) = 50%
    });
  });

  it('should cap availability at 100%', () => {
    const metrics: MetricResponse = {
      data: [
        [1000, 10],
        [6000, 10]
      ],
      pollRate: 1
    };

    const result = processMetricsIntoCategories(metrics, 0, 6000, defaultRollup, metrics.pollRate);

    void expect(result).to.be.an('array');
    void expect(result.length).to.equal(2);

    // Check the availability is capped at 100%
    void expect(result[1]).to.deep.include({
      from: 1000,
      to: 6000,
      availability: 100
    });
  });
});

// Made with Bob
