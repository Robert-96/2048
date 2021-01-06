/* global jest, describe, test, expect */
'use strict';

import './utils.js';

import { Game, Tile } from '../src/game.js';

jest.useFakeTimers();

test('it should set the socre to 0', () => {
  const game = new Game();

  expect(game.score).toEqual(0);
});

test('it should set the best to 0', () => {
  const game = new Game();

  expect(game.best).toEqual(0);
});

test('it should set the won to false', () => {
  const game = new Game();

  expect(game.won).toEqual(false);
});

test('it should set the keepPlaying to false', () => {
  const game = new Game();

  expect(game.keepPlaying).toEqual(false);
});

test('it should set the over to false', () => {
  const game = new Game();

  expect(game.over).toEqual(false);
});

test('it should have no tiles', () => {
  const game = new Game();

  expect(game.tiles.length).toEqual(0);
});

test('it should serialize a game', () => {
  const game = new Game();

  game.score = 2;
  game.best = 4;
  game.won = false;
  game.keepPlaying = true;
  game.over = true;
  game.tiles = [ new Tile({x: 3, y: 3, value: 8}) ];

  expect(game.serialize()).toEqual({
    score: 2,
    best: 4,
    won: false,
    keepPlaying: true,
    over: true,
    tiles: [
      {
        x: 3,
        y: 3,
        value: 8
      }
    ]
  })
});

test('it should deserialize a game', () => {
  const game = new Game();

  game.deserialize({
    score: 2,
    best: 4,
    won: false,
    keepPlaying: true,
    over: false
  })

  expect(game.serialize()).toEqual({
    score: 2,
    best: 4,
    won: false,
    keepPlaying: true,
    over: false,
    tiles: []
  })
});

test('it should deserialize a game with tiles', () => {
  const game = new Game();

  game.deserialize({
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
});

test('it should correctly convert the tiles array into a matrix', () => {
  const game = new Game();
  game.tiles = [
    new Tile({x: 0, y: 0, value: 2}),
    new Tile({x: 1, y: 1, value: 4}),
    new Tile({x: 2, y: 2, value: 8}),
    new Tile({x: 3, y: 3, value: 16}),
  ];

  expect(game.generateMartix()).toEqual([
    [game.tiles[0], null, null, null],
    [null, game.tiles[1], null, null],
    [null, null, game.tiles[2], null],
    [null, null, null, game.tiles[3]],
  ])
});

test('it should generate a random position that is not taken by another tile', () => {
  const game = new Game();
  game.tiles = [
    new Tile({x: 0, y: 0, value: 2}),
  ];

  for (let i = 0; i <= 100; i++) {
    expect(game.getRandomPosition()).not.toEqual({
      x: 0,
      y: 0
    })
  }
});

test('it should get the max value tile', () => {
  const game = new Game();
  game.tiles = [
    new Tile({x: 0, y: 0, value: 2}),
    new Tile({x: 1, y: 1, value: 8}),
    new Tile({x: 2, y: 2, value: 4}),
    new Tile({x: 3, y: 3, value: 16}),
  ];

  expect(game.maxTile()).toBe(16);
});

test('it should create a new tile', () => {
  const game = new Game();
  game.createTile();

  expect(game.tiles.length).toBe(1);
});

test('it should update the score and the best when a new tile is created', () => {
  const game = new Game();
  game.createTile();

  expect(game.score).toBe(game.tiles[0].value);
  expect(game.best).toBe(game.tiles[0].value);
});

test('it should create a new tile at a given position', () => {
  const game = new Game();
  game.createTile({
    x: 3,
    y: 3,
    value: 2048
  });

  expect(game.tiles[0].serialize()).toEqual({
    x: 3,
    y: 3,
    value: 2048
  });
});

test('it should not create a new tile if the grid is full', () => {
  const game = new Game();

  for (let i = 0; i <= 100; i++) {
    game.createTile();
  }

  expect(game.tiles.length).toBe(16);
});

test('it should remove a tile', () => {
  const tile = new Tile();
  const game = new Game();
  game.tiles = [ tile ];

  for (let i = 0; i < 5; i++) {
    game.createTile();
  }

  game.removeTile(tile);
  expect(tile).not.toBeIncludedIn(game.tiles);
});

test('it should remove all tiles', () => {
  const game = new Game();

  for (let i = 0; i < 5; i++) {
    game.createTile();
  }

  game.removeAllTiles();
  expect(game.tiles.length).toBe(0);
});

test('it should set keepPlaying to true', () => {
  const game = new Game();
  game.continue();

  expect(game.keepPlaying).toBe(true);
})

test('it should reset the game', () => {
  const game = new Game();

  game.score = 2;
  game.best = 4;
  game.won = false;
  game.keepPlaying = true;
  game.over = true;
  game.tiles = [ new Tile({x: 3, y: 3, value: 8}) ];

  game.reset();

  expect(game.won).toBe(false);
  expect(game.over).toBe(false);
  expect(game.keepPlaying).toBe(false);
});

describe('Setup', () => {
  test('it should create two tiles', () => {
    const game = new Game();
    game.setUp();

    expect(game.tiles.length).toBe(2);
  });

  test('it should not create new tiles if the grid is not empty', () => {
    const game = new Game();
    game.tiles = [ new Tile() ];
    game.setUp();

    expect(game.tiles.length).toBe(1);
  })
});

describe('Status', () => {
  test('it should set won to true if 2048 is reached', () => {
    const game = new Game();

    game.createTile({value: 2048});

    game.updateStatus();
    expect(game.won).toBe(true);
  });

  test('it should call onWinning if 2048 is reached', () => {
    const game = new Game({
      'onWinning': jest.fn(),
      'onGameOver': jest.fn()
    });

    game.createTile({value: 2048});

    game.updateStatus();
    expect(game.onWinning).mockToBeCalled();
    expect(game.onGameOver).not.mockToBeCalled();
  });

  test('it should set over to true if there are no moves', () => {
    const game = new Game();

    for (let i = 0; i < 16; i++) {
      game.createTile({value: 2 ^ (i + 1)});
    }

    game.updateStatus();
    expect(game.over).toBe(true);
  });

  test('it should call onGameOver if there are no moves', () => {
    const game = new Game({
      'onWinning': jest.fn(),
      'onGameOver': jest.fn()
    });

    for (let i = 0; i < 16; i++) {
      game.createTile({value: 2 ^ (i + 1)});
    }

    game.updateStatus();
    expect(game.onGameOver).mockToBeCalled();
    expect(game.onWinning).not.mockToBeCalled();
  });
});

describe('Slide', () => {
  describe('Up', () => {
    test('is should move up a tile', () => {
      const tile = new Tile({x: 3, y: 0, value: 8});
      const game = new Game();

      game.tiles = [
        tile
      ];

      game.slide('up');
      expect(tile.serialize()).toEqual(
        {
          x: 0,
          y: 0,
          value: 8
        }
      );
    });

    test('it should merge two tiles', () => {
      const game = new Game();

      game.tiles = [
        new Tile({x: 3, y: 0, value: 8}),
        new Tile({x: 2, y: 0, value: 8}),
      ];

      game.slide('up');
      expect(game.serialize().tiles).toEqual(
        [{x: 0, y: 0, value: 16}]
      );
    });
  });

  describe('Down', () => {
    test('is should move down a tile', () => {
      const tile = new Tile({x: 0, y: 0, value: 8});
      const game = new Game();

      game.tiles = [
        tile
      ];

      game.slide('down');
      expect(tile.serialize()).toEqual(
        {
          x: 3,
          y: 0,
          value: 8
        }
      );
    });

    test('it should merge two tiles', () => {
      const game = new Game();

      game.tiles = [
        new Tile({x: 0, y: 0, value: 8}),
        new Tile({x: 1, y: 0, value: 8}),
      ];

      game.slide('down');
      expect(game.serialize().tiles).toEqual(
        [{x: 3, y: 0, value: 16}]
      );
    });
  });

  describe('Left', () => {
    test('is should move left a tile', () => {
      const tile = new Tile({x: 0, y: 3, value: 2});
      const game = new Game();

      game.tiles = [
        tile
      ];

      game.slide('left');
      expect(tile.serialize()).toEqual(
        {
          x: 0,
          y: 0,
          value: 2
        }
      );
    });

    test('it should merge two tiles', () => {
      const game = new Game();

      game.tiles = [
        new Tile({x: 0, y: 3, value: 8}),
        new Tile({x: 0, y: 2, value: 8}),
      ];

      game.slide('left');
      expect(game.serialize().tiles).toEqual(
        [{x: 0, y: 0, value: 16}]
      );
    });
  });

  describe('Right', () => {
    test('is should move right a tile', () => {
      const tile = new Tile({x: 0, y: 0, value: 2});
      const game = new Game();

      game.tiles = [
        tile
      ];

      game.slide('right');
      expect(tile.serialize()).toEqual(
        {
          x: 0,
          y: 3,
          value: 2
        }
      );
    });

    test('it should merge two tiles', () => {
      const game = new Game();

      game.tiles = [
        new Tile({x: 0, y: 1, value: 8}),
        new Tile({x: 0, y: 2, value: 8}),
      ];

      game.slide('right');
      expect(game.serialize().tiles).toEqual(
        [{x: 0, y: 3, value: 16}]
      );
    });
  })
});

describe('Move', () => {
  test('it should not move if the game is over', () => {
    const game = new Game({
      'onMove': jest.fn()
    });
    game.over = true;
    game.setUp();

    game.move('up');
    expect(game.onMove).not.mockToBeCalled();
  });

  test('it should not move if the game is won and not keepPlaying', () => {
    const game = new Game({
      'onMove': jest.fn()
    });
    game.won = true;
    game.keepPlaying = false;
    game.setUp();

    game.move('up');
    expect(game.onMove).not.mockToBeCalled();
  });

  test('it should move if the game is won and keepPlaying', () => {
    const game = new Game({
      'onMove': jest.fn()
    });
    game.won = true;
    game.keepPlaying = true;
    game.setUp();

    game.move('up');
    expect(game.onMove).mockToBeCalled();
  });

  jest.retryTimes(10);
  test('it should create a new tile', () => {
    const game = new Game();
    game.setUp();

    game.move('up');
    expect(game.tiles.length).toBe(3);
  })

  test('it should call onMove', () => {
    const game = new Game({
      'onMove': jest.fn()
    });

    game.move('up');
    expect(game.onMove).mockToBeCalled();
  });
});
