/* global test, expect */

import './utils.js';

import { Tile, Game, Storage } from '../src/game.js';

test('it should save the game data', () => {
  const game = new Game();
  const storage = new Storage(game);

  game.score = 2;
  game.best = 4;
  game.won = true;
  game.keepPlaying = true;
  game.over = true;
  game.tiles = [ new Tile({x: 3, y: 3, value: 8}) ];

  storage.save();

  expect(localStorage.getItem('score')).toBe('2');
  expect(localStorage.getItem('best')).toBe('4');
  expect(localStorage.getItem('won')).toBe('true');
  expect(localStorage.getItem('keepPlaying')).toBe('true');
  expect(localStorage.getItem('over')).toBe('true');
  expect(JSON.parse(localStorage.getItem('tiles'))).toEqual([
    {
      x: 3,
      y: 3,
      value: 8
    }
  ]);
});

test('it should load the game data', () => {
  const game = new Game();
  const storage = new Storage(game);

  localStorage.setItem('loglevel:webpack-dev-server', 'INFO');
  localStorage.setItem('score', 2);
  localStorage.setItem('best', 4);
  localStorage.setItem('won', false);
  localStorage.setItem('keepPlaying', true);
  localStorage.setItem('over', false);
  localStorage.setItem('tiles', JSON.stringify([
    {
      x: 3,
      y: 3,
      value: 8
    }
  ]));

  storage.load();

  expect(game.serialize()).toEqual({
    score: 2,
    best: 4,
    won: false,
    keepPlaying: true,
    over: false,
    tiles: [
      {
        x: 3,
        y: 3,
        value: 8
      }
    ]
  })
})