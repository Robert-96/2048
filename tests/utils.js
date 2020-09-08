/* global expect */

import { indexOf } from 'lodash';

expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },

  toBeIncludedIn(received, options) {
    const pass = indexOf(options, received) != -1;

    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within ${options}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within ${options}`,
        pass: false,
      };
    }
  },

  mockToBeCalled(received) {
    const pass = received.mock.calls.length > 0;

    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be called at least once`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be called at least once`,
        pass: false,
      };
    }
  }
});