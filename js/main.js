// =============================================================================
// sprites
// =============================================================================
//browser-sync start --server --files="**/*.js"
//
// HERO sprite
//
function Hero(game, x, y, image) {
    // call Phaser.Sprite constructor
    Phaser.Sprite.call(this, game, x, y, image);

    this.anchor.set(0.5, 0.5);
}

// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

// =============================================================================
// game states
// =============================================================================

PlayState = {};

PlayState.preload = function () {
    this.game.load.json('map01', 'data/map01.json');

    this.game.load.image('background', 'images/background.png');
    this.game.load.image('ground', 'images/ground.png');
    this.game.load.image('grass:8x1', 'images/grass_8x1.png');
    this.game.load.image('grass:6x1', 'images/grass_6x1.png');
    this.game.load.image('grass:4x1', 'images/grass_4x1.png');
    this.game.load.image('grass:2x1', 'images/grass_2x1.png');
    this.game.load.image('grass:1x1', 'images/grass_1x1.png');
    this.game.load.image('hero', 'images/hero_stopped.png');
    this.game.load.image('hero1', 'images/hero1_stopped.png');
};

PlayState.create = function () {
    this.game.add.image(0, 0, 'background');
    this._loadLevel(this.game.cache.getJSON('map01'));
};

PlayState.update = function () {//mira cada fotograma si hay alguna tecla presionada
    this._handleInput();
};

var rightPressed= false;
var leftPressed=false;
var aPressed=false;
var dPressed=false;
Hero.prototype.move = function (direction) {
    this.x += direction * 2.5; // 2.5 pixels each frame
};
PlayState._handleInput = function () {//si la tecla es presionada
  if (leftPressed) { // move hero left
      this.hero.move(-1);
  }
  else if (rightPressed) { // move hero right
      this.hero.move(1);
  }
  if (aPressed) {
      this.hero1.move(-1);
  }else if (dPressed) {
      this.hero1.move(1);
  }
};
PlayState._loadLevel = function (data) {
    // spawn all platforms
    data.platforms.forEach(this._spawnPlatform, this);
    // spawn hero and enemies
    this._spawnCharacters({hero: data.hero, spiders: data.spiders, hero1: data.hero1});
};

PlayState._spawnPlatform = function (platform) {
    this.game.add.sprite(platform.x, platform.y, platform.image);
};

PlayState._spawnCharacters = function (data) {
    // spawn hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y, "hero");
    this.hero1 = new Hero(this.game, data.hero1.x, data.hero1.y, "hero1");
    this.game.add.existing(this.hero);
    this.game.add.existing(this.hero1);
};

// =============================================================================
// entry point
// =============================================================================

window.onload = function () {
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    game.state.add('play', PlayState);
    game.state.start('play');
};
