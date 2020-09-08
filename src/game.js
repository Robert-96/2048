'use strict';

import { defaultTo, uniqueId, random, without } from 'lodash';

class Tile {
  constructor(options) {
    options = defaultTo(options, {});
    this.id = uniqueId('tile-');

    this.value = defaultTo(options.value, random(1, 2) * 2);
    this.x = defaultTo(options.x, random(0, 3));
    this.y = defaultTo(options.y, random(0, 3));
  }

  serialize() {
    return {
      'x': this.x,
      'y': this.y,
      'value': this.value
    }
  }

  deserialize(json) {
    this.update(json);
  }

  update(options) {
    options = defaultTo(options, {});

    this.value = defaultTo(options.value, this.value);
    this.x = defaultTo(options.x, this.x);
    this.y = defaultTo(options.y, this.y);
  }
}

class Game {
  constructor(callbacks) {
    callbacks = defaultTo(callbacks, {});

    this.score = 0;
    this.best = 0;

    this.won = false;
    this.over = false;
    this.keepPlaying = false;

    this.tiles = [];

    this.drawTile = defaultTo(callbacks.drawTile, () => {});
    this.updateTile = defaultTo(callbacks.updateTile, () => {});
    this.deleteTile = defaultTo(callbacks.deleteTile, () => {});

    this.onMove = defaultTo(callbacks.onMove, () => {});
    this.onScoreUpdate = defaultTo(callbacks.onScoreUpdate, () => {});
    this.onBestUpdate = defaultTo(callbacks.onBestUpdate, () => {});
    this.onWinning = defaultTo(callbacks.onWinning, () => {});
    this.onGameOver = defaultTo(callbacks.onGameOver, () => {});
    this.onReset = defaultTo(callbacks.onReset, () => {});
  }

  serialize() {
    return {
      'score': this.score,
      'best': this.best,
      'won': this.won,
      'over': this.over,
      'keepPlaying': this.keepPlaying,
      'tiles': this.tiles.map((tile) => tile.serialize())
    }
  }

  deserialize(json) {
    this.score = defaultTo(json.score, this.score);
    this.best = defaultTo(json.best, this.best);
    this.won = defaultTo(json.won, this.won);
    this.over = defaultTo(json.over, this.over);
    this.keepPlaying = defaultTo(json.keepPlaying, this.keepPlaying);

    if (json.tiles) {
      this.tiles = json['tiles'].map((json) => {
        let tile = new Tile();
        tile.deserialize(json);

        this.drawTile(tile);
        return tile;
      });
    } else {
      this.tiles = [];
    }

    this.onScoreUpdate(this.score);
    this.onBestUpdate(this.best);
    this.updateStatus();
  }

  generateMartix() {
    let matrix = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]

    this.tiles.forEach((tile) => {
      matrix[tile.x][tile.y] = tile;
    })

    return matrix;
  }

  getRandomPosition() {
    const matrix = this.generateMartix();
    let x, y;

    do {
      x = random(0, 3);
      y = random(0, 3);
    } while (matrix[x][y] != null);

    return {x: x, y: y};
  }

  maxTile() {
    let maxTile = 0;

    this.tiles.forEach((tile) => {
      if (tile.value > maxTile) {
        maxTile = tile.value;
      }
    });

    return maxTile;
  }

  createTile(positions) {
    if (this.tiles.length < 16) {
      const tile = new Tile(positions || this.getRandomPosition());

      this.tiles.push(tile);
      this.addPoints(tile.value);

      setTimeout(() => {
        this.drawTile(tile);
      }, 100);
    }
  }

  moveTile(tile, options) {
    const merged = tile.value !== defaultTo(options.value, tile.value);

    tile.update(options);
    this.updateTile(tile, merged);
  }

  removeTile(tile) {
    this.tiles = without(this.tiles, tile);
    this.deleteTile(tile);
  }

  removeAllTiles() {
    this.tiles.forEach((tile) => {
      this.deleteTile(tile);
    })

    this.tiles = [];
  }

  isWon() {
    return this.maxTile() === 2048;
  }

  isOver() {
    if (this.tiles.length < 16) {
      return false;
    }

    const matrix = this.generateMartix();
    const positions = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: -1, y: 0 }
    ]

    let found = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const tile = matrix[i][j];

        if (tile && this.tiles.length === 16) {
          positions.forEach((position) => {
            let {x, y} = position;

            const neighbour = matrix[i + x] ? matrix[i + x][j + y] : null;

            if (neighbour) {
              found = found || (neighbour.value === tile.value);
            }
          })
        }
      }
    }

    return !found;
  }

  updateStatus() {
    this.won = this.isWon();
    this.over = this.isOver();

    if (this.won && !this.keepPlaying) {
      this.onWinning();
    } else if (this.over) {
      this.onGameOver();
    }
  }

  updateScore(score) {
    this.score = score;

    if (score > this.best) {
      this.updateBest(score);
    }

    this.onScoreUpdate(this.score);
  }

  addPoints(points) {
    this.updateScore(this.score + points);
  }

  updateBest(best) {
    this.best = best;
    this.onBestUpdate(best);
  }

  getMoveFunctions(direction) {
    let positionFunction = null;
    let moveFunction = null;

    if (direction === "up") {
      positionFunction = (i, j) => { return { 'i': j, 'j': i } };
      moveFunction = (x, y, moves) => { return { 'x': x - moves, 'y': y } };
    } else if (direction === "down") {
      positionFunction = (i, j) => { return { 'i': 3 - j, 'j': i } };
      moveFunction = (x, y, moves) => { return { 'x': x + moves, 'y': y } };
    } else if (direction === "left") {
      positionFunction = (i, j) => { return { 'i': i, 'j': j } };
      moveFunction = (x, y, moves) => { return { 'x': x , 'y': y - moves } };
    } else if (direction === "right") {
      positionFunction = (i, j) => { return { 'i': i, 'j': 3 - j } };
      moveFunction = (x, y, moves) => { return { 'x': x , 'y': y + moves } };
    }

    return {
      'positionFunction': positionFunction,
      'moveFunction': moveFunction
    }
  }

  slide(direction) {
    const { positionFunction, moveFunction } = this.getMoveFunctions(direction);
    const matrix = this.generateMartix();
    let moved = false;

    for (let i = 0; i < 4; i++) {
      let lastTile = null;
      let value = 0;
      let moves = 0;

      for (let j = 0; j < 4; j++) {
        const position = positionFunction(i, j);
        const tile = matrix[position['i']][position['j']];

        if (tile) {
          const tileValue = tile.value;
          const destination = moveFunction(tile.x, tile.y, moves + (value == tileValue ? 1 : 0));

          this.addPoints(value == tileValue ? tileValue * 2 : 0);
          this.moveTile(tile, {
            x: destination['x'],
            y: destination['y'],
            value: value == tileValue ? tileValue * 2 : tileValue
          });

          if (value == tileValue) {
            this.removeTile(lastTile);
          }

          moved = moved || (moves + (value == tileValue ? 1 : 0)) > 0;
          moves = value == tileValue ? moves + 1 : moves;
          value = value == tileValue ? 0 : tileValue;
          lastTile = tile;
        } else {
          moves += 1;
        }
      }
    }

    return moved;
  }

  move(direction) {
    if (this.over || (this.won && !this.keepPlaying)) {
      return;
    }

    const moved = this.slide(direction);

    if (moved) {
      this.createTile();
    }

    this.updateStatus();
    this.onMove();
  }

  continue() {
    this.keepPlaying = true;
    this.onReset();
  }

  reset() {
    this.score = 0;

    this.won = false;
    this.keepPlaying = false;
    this.over = false;

    this.removeAllTiles();
    this.setUp();

    this.onReset();
  }

  setUp() {
    if (this.tiles.length > 0) {
      return;
    }

    for (let i = 0; i < 2; i++) {
      this.createTile();
    }
  }
}

class Storage {
  constructor(game) {
    this.game = game;
  }

  save() {
    for (const [key, value] of Object.entries(this.game.serialize())) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  load() {
    let json = {};

    for (const key of Object.keys(window.localStorage)) {
      if (key === 'loglevel:webpack-dev-server') {
        continue;
      }

      json[key] = JSON.parse(localStorage.getItem(key));
    }

    this.game.deserialize(json);
  }
}

class Swipe {
  constructor(callbacks) {
    callbacks = defaultTo(callbacks, {});

    this.xDown = null;
    this.yDown = null;

    this.onUp = defaultTo(callbacks.onUp, () => {});
    this.onDown = defaultTo(callbacks.onDown, () => {});
    this.onLeft = defaultTo(callbacks.onLeft, () => {});
    this.onRight = defaultTo(callbacks.onRight, () => {});
  }

  handelTouchStart(event) {
    event.preventDefault();

    this.xDown = event.touches[0].clientX;
    this.yDown = event.touches[0].clientY;
  }

  handleTouchMove(event) {
    event.preventDefault();

    if (!this.xDown || !this.yDown) {
      return;
    }

    const xUp = event.touches[0].clientX;
    const yUp = event.touches[0].clientY;

    const xDiff = this.xDown - xUp;
    const yDiff = this.yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        this.onLeft();
      } else {
        this.onRight();
      }
    } else {
      if (yDiff > 0) {
        this.onUp();
      } else {
        this.onDown();
      }
    }

    this.xDown = null;
    this.yDown = null;
  }

  setUp() {
    document.addEventListener('touchstart', this.handelTouchStart.bind(this));
    document.addEventListener('touchmove', this.handleTouchMove.bind(this));
  }
}

class Renderer {
  tileSize = 18;
  tileUnit = 'vmin';

  commonClasses = ['grid-cell', 'grid-tile'];
  defaultClasses = ['bg-red-700', 'glow-red-700', 'font-size-extra-small'];
  classMaps = {
    2: ['bg-pink-500', 'font-size-big'],
    4: ['bg-purple-500', 'font-size-big'],
    8: ['bg-indigo-500', 'font-size-big'],
    16: ['bg-blue-500', 'font-size-big'],
    32: ['bg-teal-500', 'font-size-big'],
    64: ['bg-teal-600', 'font-size-big'],
    128: ['bg-green-500', 'font-size-medium'],
    256: ['bg-green-600', 'font-size-medium'],
    512: ['bg-yellow-500', 'glow-yellow-500', 'font-size-medium'],
    1024: ['bg-yellow-600', 'glow-yellow-600', 'font-size-small'],
    2048: ['bg-orange-500', 'glow-orange-500', 'font-size-small'],
    4096: ['bg-orange-600', 'glow-orange-600', 'font-size-small'],
    8192: ['bg-red-500', 'glow-red-500', 'font-size-small'],
    16384: ['bg-red-600', 'glow-red-600', 'font-size-extra-small'],
  };

  position(value) {
    return value * 2 * 0.75 + 0.75 + value * this.tileSize;
  }

  top(tile) {
    return this.position(tile.x);
  }

  left(tile) {
    return this.position(tile.y);
  }

  classes(tile) {
    return defaultTo(this.classMaps[tile.value], this.defaultClasses);
  }

  draw(tile) {
    let element = document.createElement('div');

    element.id = tile.id;

    element.classList.add(...this.commonClasses, ...this.classes(tile));

    element.style.top = `${this.top(tile)}${this.tileUnit}`;
    element.style.left = `${this.left(tile)}${this.tileUnit}`;

    element.textContent = tile.value;
    element.style.zIndex = tile.value;

    const container = document.getElementById('tiles');
    container.appendChild(element);
  }

  update(tile, merged) {
    merged = defaultTo(merged, false);

    const element = document.getElementById(tile.id);

    element.className = '';
    element.textContent = tile.value;
    element.style.zIndex = tile.value;
    element.classList.add(...this.commonClasses, ...this.classes(tile))

    element.style.top = `${this.top(tile)}${this.tileUnit}`;
    element.style.left = `${this.left(tile)}${this.tileUnit}`;

    if (merged) {
      element.classList.remove('scale-animation');
      setTimeout(() => {
        element.classList.add('scale-animation');
      }, 0)
    }
  }

  delete(tile) {
    const element = document.getElementById(tile.id)
    element.style.display = 'none';

    setTimeout(() => {
      element.remove();
    }, 100)
  }
}

class Interactions {
  constructor() {
    this.renderer = new Renderer();

    this.game = new Game({
      'drawTile': this.renderer.draw.bind(this.renderer),
      'updateTile': this.renderer.update.bind(this.renderer),
      'deleteTile': this.renderer.delete.bind(this.renderer),
      'onMove': this.onMove.bind(this),
      'onScoreUpdate': this.onScoreUpdate.bind(this),
      'onBestUpdate': this.onBestUpdate.bind(this),
      'onWinning': this.onWinning.bind(this),
      'onGameOver': this.onGameOver.bind(this),
      'onReset': this.onReset.bind(this),
    });

    this.title = document.title;

    this.storage = new Storage(this.game);
    this.storage.load();
  }

  showWinOverlay() {
    const overlay = document.getElementById('win-overlay');
    overlay.classList.remove('hidden');
  }

  hideWinOverlay() {
    const overlay = document.getElementById('win-overlay');
    overlay.classList.add('hidden');
  }

  showGameOverOverlay() {
    const overlay = document.getElementById('game-over-overlay');
    overlay.classList.remove('hidden');
  }

  hideGameOverOverlay() {
    const overlay = document.getElementById('game-over-overlay');
    overlay.classList.add('hidden');
  }

  onMove() {
    this.storage.save();
  }

  onScoreUpdate(score) {
    document.getElementById('score').textContent = score;
    document.title = this.game.maxTile() + " | " + this.title;
  }

  onBestUpdate(best) {
    document.getElementById('best').textContent = best;
  }

  onWinning() {
    this.showWinOverlay();
  }

  onGameOver() {
    this.showGameOverOverlay();
  }

  onReset() {
    this.hideWinOverlay();
    this.hideGameOverOverlay();
  }

  setUpNewGameButtons() {
    const ids = ['new-game', 'win-new-game', 'game-over-try-again'];
    const game = this.game;

    ids.forEach((id) => {
      const button = document.getElementById(id);

      button.addEventListener('click', () => {
        game.reset();
      })
    })
  }

  setUpKeepPlayingButton() {
    const button = document.getElementById('win-keep-playing');

    button.addEventListener('click', () => {
      this.game.continue();
    })
  }

  setUpKeyEvents() {
    document.addEventListener('keydown', (event) => {
      event.preventDefault();

      if (event.code === "ArrowUp" || event.code === "KeyW") {
        this.game.move("up");
      } else if (event.code === "ArrowDown" || event.code === "KeyS") {
        this.game.move("down");
      } else if (event.code === "ArrowLeft" || event.code === "KeyA") {
        this.game.move("left");
      } else if (event.code === "ArrowRight" || event.code === "KeyD") {
        this.game.move("right");
      }
    });
  }

  setUpSwipeEvent() {
    this.swipe = new Swipe({
      'onUp': () => { this.game.move("up") },
      'onDown': () => { this.game.move("down") },
      'onLeft': () => { this.game.move("left") },
      'onRight': () => { this.game.move("right") }
    });

    this.swipe.setUp();
  }

  setUp() {
    this.game.setUp();

    this.setUpNewGameButtons();
    this.setUpKeepPlayingButton();
    this.setUpKeyEvents();
    this.setUpSwipeEvent();
  }
}

export { Tile, Game, Storage, Swipe, Renderer, Interactions }