/* global test, expect */
'use strict';

import './utils.js';

import { Renderer } from '../src/game.js';

test('it should correctly compute the position', () => {
  const renderer = new Renderer();

  expect(renderer.position(0)).toBe(0.75);
  expect(renderer.position(1)).toBe(20.25);
  expect(renderer.position(2)).toBe(39.75);
  expect(renderer.position(3)).toBe(59.25);
})

test('it should correctly compute the top position', () => {
  const renderer = new Renderer();

  expect(renderer.top({x: 0, y: 3})).toBe(renderer.position(0));
  expect(renderer.top({x: 1, y: 2})).toBe(renderer.position(1));
  expect(renderer.top({x: 2, y: 1})).toBe(renderer.position(2));
  expect(renderer.top({x: 3, y: 0})).toBe(renderer.position(3));
})

test('it should correctly compute the left position', () => {
  const renderer = new Renderer();

  expect(renderer.left({x: 3, y: 0})).toBe(renderer.position(0));
  expect(renderer.left({x: 2, y: 1})).toBe(renderer.position(1));
  expect(renderer.left({x: 1, y: 2})).toBe(renderer.position(2));
  expect(renderer.left({x: 0, y: 3})).toBe(renderer.position(3));
})

test('it should correctly return the css classes', () => {
  const renderer = new Renderer();

  expect(renderer.classes({value: 2})).toEqual(["bg-pink-500", "font-size-big"]);
  expect(renderer.classes({value: 2048})).toEqual(['bg-orange-500', 'glow-orange-500', 'font-size-small']);
  expect(renderer.classes({value: 32768})).toEqual(['bg-red-700', 'glow-red-700', 'font-size-extra-small'])
})
