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
    this.life=true;
    this.hp=100;
    this.anchor.set(0.5, 0.5);
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true; //si quieres que no se mueva mas del limite del mundo
    this.animations.add('stop', [0]);
    this.animations.add('run', [1, 2], 8, true); // 8fps looped
    this.animations.add('jump', [3]);
    this.animations.add('fall', [4]);
}

function Bullet(game, x, y, image) {
    Phaser.Sprite.call(this, game, x, y, image);
    this.anchor.set(0.5, 0.5);
    this.game.physics.enable(this);
}


// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

// =============================================================================
// game states
// =============================================================================

PlayState = {};

PlayState.init = function () {
    // ...
    this.game.renderer.renderSession.roundPixels = true;
    this.coinPickupCount = 0;
};

PlayState.preload = function () {
    this.game.load.json('map01', 'data/map01.json');
    this.game.load.image('background', 'images/background.png');
    this.game.load.image('ground', 'images/ground.png');
    this.game.load.image('grass:8x1', 'images/grass_8x1.png');
    this.game.load.image('grass:6x1', 'images/grass_6x1.png');
    this.game.load.image('grass:4x1', 'images/grass_4x1.png');
    this.game.load.image('grass:2x1', 'images/grass_2x1.png');
    this.game.load.image('grass:1x1', 'images/grass_1x1.png');
    this.game.load.spritesheet('hero', 'images/hero1.png', 36, 42);
    this.game.load.spritesheet('hero1', 'images/hero.png', 36, 42);
    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);
    this.game.load.spritesheet('arma', 'images/pistola_animated.png', 22, 22, 7);
    this.game.load.audio('sfx:coin', 'audio/coin.wav');
    this.game.load.image('bullet', 'images/bullet.png');
    this.game.load.image('gun', 'images/weapon.png');
    this.game.load.audio('sfx:stomp', 'audio/stomp.wav');
    this.game.load.audio('sfx:finnAttack', 'audio/attackSword.wav');
    this.game.load.audio('sfx:orlAttack', 'audio/shot.wav');
    this.game.load.audio('sfx:finnGasp', 'audio/maleGasp.wav');
    this.game.load.audio('sfx:orlGasp', 'audio/orlGasp.wav');
    this.game.load.image('icon:hp', 'images/hpFinn.png');
    this.game.load.image('icon:hp1', 'images/hpOrl.png');
    this.game.load.image('font:numbers', 'images/numbers.png');
};

PlayState.create = function () {
  //  Register the keys.
	this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.up = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
  this.down = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  this.period = this.game.input.keyboard.addKey(Phaser.Keyboard.PERIOD);
  this.f = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
  this.w = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  this.a = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  this.s = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  this.d = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    //  Stop the following keys from propagating up to the browser
    this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.F, Phaser.Keyboard.W, Phaser.Keyboard.A, Phaser.Keyboard.S, Phaser.Keyboard.D, Phaser.Keyboard.PERIOD, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN]);

    this.game.add.image(0, 0, 'background');
    this._createHud();
    this._loadLevel(this.game.cache.getJSON('map01'));
    //Sounds
    this.sfx = {
      jump: this.game.add.audio('sfx:jump'),
      coin: this.game.add.audio('sfx:coin'),
      stomp: this.game.add.audio('sfx:stomp'),
      finnAtack: this.add.audio('sfx:finnAttack'),
      orlAttack: this.add.audio('sfx:orlAttack'),
      finnGasp: this.add.audio('sfx:finnGasp'),
      orlGasp: this.add.audio('sfx:orlGasp')
  };
  //  Creates 1 single bullet, using the 'bullet' graphic
    weapon = this.game.add.weapon(1, 'bullet');
    sGun = this.game.add.weapon(1, 'gun');

    //  The bullet will be automatically killed when it leaves the world bounds
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  Because our bullet is drawn facing up, we need to offset its rotation:
    weapon.bulletAngleOffset = 0;

    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 1300;
    weapon.bulletGravity = 9000;
    weapon.fireRate = 100;
    weapon.nextFire = 1000;
    sprite = this.gun;
    sprite.body.allowGravity = false;
    this.game.physics.arcade.enable(weapon);
    //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
    weapon.trackSprite(sprite, 0, 0, true);
    //this.game.time.events.add(Phaser.Timer.SECOND * 1, timeMass, this);
};
window.setInterval(timeMas, 1000);
function timeMas() {
   timeA++;
   timeD++;
   time++;
}
PlayState.update = function () {
    this._handleCollisions();
    this._handleInput();
    this.gun.body.y=this.hero.body.y+15;
    this.coinFont.text = `x${this.hero1.hp}`;
    this.coinFont1.text = `x${this.hero.hp}`;
};
PlayState._createHud = function () {
  const NUMBERS_STR = '0123456789X ';
   this.coinFont = this.game.add.retroFont('font:numbers', 20, 26,
       NUMBERS_STR, 6);
       this.coinFont1 = this.game.add.retroFont('font:numbers', 20, 26,
           NUMBERS_STR, 6);
    let hpIcon = this.game.make.image(150, 0, 'icon:hp');
    let hpIcon1 = this.game.make.image(0, 0, 'icon:hp1');
    let coinScoreImg = this.game.make.image(hpIcon.x + hpIcon.width,
        hpIcon.height / 2, this.coinFont);
    let coinScoreImg1 = this.game.make.image(hpIcon1.x + hpIcon1.width,
        hpIcon1.height / 2, this.coinFont1);
    coinScoreImg.anchor.set(0, 0.5);
    coinScoreImg1.anchor.set(0, 0.5);
    this.hud = this.game.add.group();
    this.hud1= this.game.add.group();
    this.hud.add(hpIcon);
    this.hud1.add(hpIcon1);
    this.hud.position.set(40, 10);
    this.hud1.position.set(10 , 10);
    this.hud.add(coinScoreImg);
    this.hud1.add(coinScoreImg1);
};
PlayState._handleCollisions = function () {
    this.game.physics.arcade.collide(this.hero1, this.platforms);//hacer que hero1 colisione con las plataformas
    this.game.physics.arcade.collide(this.hero, this.platforms);//hacer que hero colisione con las plataformas

    this.game.physics.arcade.overlap(this.hero, this.armas, this._onHeroVsCoin, null, this);//hacer que hero recoja las cosas
    this.game.physics.arcade.overlap(this.hero1, this.armas, this._onHeroVsCoin, null, this);//hacer que hero1 recoja las cosas
    this.game.physics.arcade.overlap(this.hero1, weapon.bullets, this._onHeroVsBullet, null, this);
    this.game.physics.arcade.overlap(this.platforms, weapon.bullets, this._platformsVsBullet, null, this);
    this.game.physics.arcade.overlap(this.hero, this.hero1, this._Hero1VsHero, null, this);
  //  this.game.physics.arcade.overlap(this.hero1, bullet, this._onHeroVsBullet, null, this);
};
PlayState._platformsVsBullet = function (platform, bullet) {
  bullet.kill();
}
PlayState._Hero1VsHero = function (hero1, hero) {
  if (finnA && timeD>1 && hero1.hp-25<=0) {
    hero1.life=false;
    hero1.kill();
    this.gun.kill();
  }
  if (finnA && timeD>1) {
    hero1.hp-=25;
    this.sfx.orlGasp.play();
    timeD=0;
  }
}
PlayState._onHeroVsCoin = function (hero, arma) {
  this.sfx.coin.play();
  hero.hp+=25;
  arma.kill();
};
PlayState._onHeroVsBullet = function (hero, bullet) {
  if (hero.hp-25==0) {
    hero.life=false;
    hero.kill();
  }
  hero.hp-=25;
  this.sfx.finnGasp.play();
  bullet.kill();
};
/*
PlayState._onHeroVsBullet = function (hero, bullet) {
  this.sfx.coin.play();
  bullet.kill();
  hero.hp -= 25;
};
*/
var wPressed = false;
var upPressed = false;
var rightPressed= false;
var leftPressed=false;
var aPressed=false;
var dPressed=false;
var fPressed=false;
var poPressed=false;
var weapon;
var sGun;
var timeA=0;
var timeD=0;
var time=0;
var bulls;
var finnA=false;
var hp;
var hp1;
Hero.prototype.move = function (direction, speed) {
    this.body.velocity.x = direction * speed;
    if (this.body.velocity.x < 0) {
        this.scale.x = -1;
    }
    else if (this.body.velocity.x > 0) {
        this.scale.x = 1;
    }
};
Hero.prototype._getAnimationName = function () {
    let name = 'stop'; // default animation

    // jumping
    if (this.body.velocity.y < 0) {
        name = 'jump';
    }
    // falling
    else if (this.body.velocity.y >= 0 && !this.body.touching.down) {
        name = 'fall';
    }
    else if (this.body.velocity.x !== 0 && this.body.touching.down) {
        name = 'run';
    }

    return name;
};
Hero.prototype.update = function () {
    // update sprite animation, if it needs changing
    let animationName = this._getAnimationName();
    if (this.animations.name !== animationName) {
        this.animations.play(animationName);
    }
};
Hero.prototype.jump = function () {
    const JUMP_SPEED = 600;
    let canJump = this.body.touching.down;

    if (canJump) {
        this.body.velocity.y = -JUMP_SPEED;
    }

    return canJump;
};
Hero.prototype.dashStop = function () {
    this.body.velocity.x=0;
}
Bullet.prototype.track = function (body) {
  this.x=body.x+50;
  this.y=body.y+30;
}
Bullet.prototype.move = function () {
this.bullet = new Bullet(this.game, 50, 50, "bullet");
this.bullet.body.allowGravity = false;
this.game.add.existing(this.bullet);
  const BSPEED = 600;
  this.body.velocity.x = 1 * BSPEED;
}

PlayState._handleInput = function () {//si la tecla es presionada
//FINN el humano
  if (this.leftKey.isDown  && this.period.isDown && time>2) {
    this.hero1.move(-1,950);
    finnA=true;
    this.sfx.finnAtack.play();
    if (this.hero1.body.x+this.hero1.body.width>this.hero.body.x && this.hero1.body.x+this.hero1.body.x <this.hero.body.widt  && timeD>1) {
      this.hero.hp-=25;
    }
    if (!this.leftKey.downDuration(70)) {
        time=0;
        finnA=false;
    }
  }else if (this.leftKey.isDown){
		this.hero1.move(-1,180);
	}else	if (this.rightKey.isDown && this.period.isDown && time>2) {
      this.hero1.move(1,950);
      finnA=true;
      this.sfx.finnAtack.play();
      if (this.hero1.body.x+this.hero1.body.width>this.hero.body.x && this.hero1.body.x+this.hero1.body.x <this.hero.body.widt && timeD>1) {
        this.hero.hp-=25;
      }
      if (!this.rightKey.downDuration(70)) {
          time=0;
          finnA=false;
      }
    }else if(this.rightKey.isDown){
    this.hero1.move(1,180);
	}else{
    this.hero1.move(0,250);
  }
  if (this.up.isDown) {
    this.hero1.jump();
    let didJump = this.hero1.jump();
    if (didJump) {
        this.sfx.jump.play();
    }
  }
/*
  if (leftPressed) { // move hero left
      this.hero.move(-1,250);
  }else if (rightPressed) { // move hero right
      this.hero.move(1,250);
  }else{
    this.hero.move(0,250);
  }
  */
  //dash de Finn
//else if(time<2 && !(aPressed && fPressed)){
    //this.hero1.body.acceleration.x=250;
  //}
if (this.a.isDown) {
      this.hero.move(-1,200);
      this.gun.body.x=this.hero.body.x+10;
      this.gun.body.y=this.hero.body.y;
  }else if (this.d.isDown) {
      this.hero.move(1,200);
      this.gun.body.x=this.hero.body.x+10;
      this.gun.body.y=this.hero.body.y;
  }else{
    this.hero.move(0,200);
  }
/*
  if (upPressed) {
    this.hero1.jump();
    let didJump = this.hero1.jump();
    if (didJump) {
        this.sfx.jump.play();
    }
  }
*/
  if (fPressed && timeA>2) {
      weapon.fire();
      this.sfx.orlAttack.play();
      timeA=0;
  }

  if (this.spaceKey.isDown) {
    this.hero.jump();
    let didJump = this.hero.jump();
    if (didJump) {
        this.sfx.jump.play();
    }
  }
if (this.w.isDown) {
  sprite.body.angularVelocity = -300;
  this.gun.body.angularVelocity = -300;
}else if (this.s.isDown) {
  sprite.body.angularVelocity = 300;
  this.gun.body.angularVelocity = 300;
}else {
  sprite.body.angularVelocity = 0;
  this.gun.body.angularVelocity = 0;
}
};
PlayState._loadLevel = function (data) {
    // create all the groups/layers that we need
    this.platforms = this.game.add.group();
    this.armas = this.game.add.group();

    // spawn  platforms
    data.platforms.forEach(this._spawnPlatform, this);
    // spawn heroes y armas
    this._spawnCharacters({hero: data.hero, spiders: data.spiders, hero1: data.hero1});
    data.armas.forEach(this._spawnArma, this);
    const GRAVITY = 1200;
    this.game.physics.arcade.gravity.y = GRAVITY;
};

PlayState._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
};
PlayState._spawnArma = function (arma) {
    let sprite = this.armas.create(arma.x, arma.y, 'arma');
    sprite.anchor.set(0.5, 0.5);
    sprite.animations.add('rotate', [0, 1, 2, 3], 4, true); // 6fps, looped
    sprite.animations.play('rotate');

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
};
PlayState._spawnCharacters = function (data) {
    // spawn hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y, "hero");
    this.hero1 = new Hero(this.game, data.hero1.x, data.hero1.y, "hero1");
    this.gun = new Bullet(this.game, data.hero.x, data.hero.y, "gun");
    this.gun.body.allowGravity = false;
    this.game.add.existing(this.hero);
    this.game.add.existing(this.hero1);
    this.game.add.existing(this.gun);
};

// =============================================================================
// entry point
// =============================================================================

window.onload = function () {
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    game.state.add('play', PlayState);
    game.state.start('play');
};
