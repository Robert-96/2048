/* global test, expect */
'use strict';

import './utils.js';

import { Renderer } from '../src/game.js';

test('it should correctly compute the position', () => {
  const renderer = new Renderer();

  const cellSize = 18;
  const cellMargin = 0.75;

  expect(renderer.computePosition(0, cellSize, cellMargin)).toBe(0.75);
  expect(renderer.computePosition(1, cellSize, cellMargin)).toBe(20.25);
  expect(renderer.computePosition(2, cellSize, cellMargin)).toBe(39.75);
  expect(renderer.computePosition(3, cellSize, cellMargin)).toBe(59.25);
})

test('it should correctly return the css classes', () => {
  const renderer = new Renderer();

  expect(renderer.classes({value: 2})).toEqual(["bg-pink-500", "font-size-big"]);
  expect(renderer.classes({value: 2048})).toEqual(['bg-orange-500', 'glow-orange-500', 'font-size-small']);
  expect(renderer.classes({value: 32768})).toEqual(['bg-red-700', 'glow-red-700', 'font-size-extra-small'])
})
