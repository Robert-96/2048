/* global jest, test, expect */

import './utils.js';

import { Swipe } from '../src/game.js';

test('it should detect a up swipe', () => {
  const swipe = new Swipe({
    'onUp': jest.fn()
  });

  const startEvent = {
    preventDefault: () => {},
    touches: [
      {
        clientX: 1,
        clientY: 100,
      }
    ]
  }
  const moveEvent = {
    preventDefault: () => {},
    touches: [
      {
        clientX: 1,
        clientY: 1,
      }
    ]
  }

  swipe.handelTouchStart(startEvent);
  swipe.handleTouchMove(moveEvent);

  expect(swipe.onUp).mockToBeCalled();
});

test('it should detect a down swipe', () => {
  const swipe = new Swipe({
    'onDown': jest.fn()
  });

  const startEvent = {
    preventDefault: () => {},
    touches: [
      {
        clientX: 1,
        clientY: 1,
      }
    ]
  }
  const moveEvent = {
    preventDefault: () => {},
    touches: [
      {
        clientX: 1,
        clientY: 100,
      }
    ]
  }

  swipe.handelTouchStart(startEvent);
  swipe.handleTouchMove(moveEvent);

  expect(swipe.onDown).mockToBeCalled();
});

test('it should detect a left swipe', () => {
  const swipe = new Swipe({
    'onLeft': jest.fn()
  });

  const startEvent = {
    preventDefault: () => {},
    touches: [
      {
        clientX: 100,
        clientY: 1,
      }
    ]
  }
  const moveEvent = {
    preventDefault: () => {},
    touches: [
      {
        clientX: 1,
        clientY: 1,
      }
    ]
  }

  swipe.handelTouchStart(startEvent);
  swipe.handleTouchMove(moveEvent);

  expect(swipe.onLeft).mockToBeCalled();
});

test('it should detect a right swipe', () => {
  const swipe = new Swipe({
    'onRight': jest.fn()
  });

  const startEvent = {
    preventDefault: () => {},
    touches: [
      {
        clientX: 1,
        clientY: 1,
      }
    ]
  }
  const moveEvent = {
    preventDefault: () => {},
    touches: [
      {
        clientX: 100,
        clientY: 1,
      }
    ]
  }

  swipe.handelTouchStart(startEvent);
  swipe.handleTouchMove(moveEvent);

  expect(swipe.onRight).mockToBeCalled();
});

test('it should not handel a swipe without a start', () => {
  const swipe = new Swipe({
    'onRight': jest.fn()
  });

  const moveEvent = {
    preventDefault: () => {},
    touches: [
      {
        clientX: 100,
        clientY: 100,
      }
    ]
  }

  swipe.handleTouchMove(moveEvent);

  expect(swipe.onRight).not.mockToBeCalled();
});
