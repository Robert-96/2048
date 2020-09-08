/* global test, expect */

import './utils.js';

import { Tile } from '../src/game.js';

test('it should generate an id', () => {
  const tile = new Tile();

  expect(tile.id).toBeDefined();
})

test('it should set a random position', () => {
  const tile = new Tile();

  expect(tile.x).toBeWithinRange(0, 3);
  expect(tile.y).toBeWithinRange(0, 3);
});

test('it should set the value to 2 or 4', () => {
  const tile = new Tile();
  expect(tile.value).toBeIncludedIn([2, 4]);
});

test('it should serialize a tile', () => {
  const tile = new Tile({
    x: 3,
    y: 3,
    value: 2048
  });

  expect(tile.serialize()).toEqual({
    x: 3,
    y: 3,
    value: 2048
  });
})

test('it should deserialize a tile', () => {
  const tile = new Tile();
  tile.deserialize({
    x: 3,
    y: 3,
    value: 2048
  })

  expect(tile.serialize()).toEqual({
    x: 3,
    y: 3,
    value: 2048
  });
})

test('it should update a tile', () => {
  const tile = new Tile();
  tile.update({
    x: 3,
    y: 3,
    value: 2048
  })

  expect(tile.serialize()).toEqual({
    x: 3,
    y: 3,
    value: 2048
  });
})