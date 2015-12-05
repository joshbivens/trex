var game = new Phaser.Game(
  800, 800,
  Phaser.AUTO,
  "game",
  {
    preload: preload,
    create: create,
    update: update,
    render: render
  }
);

var player, starfield, cursors, bank, bullet, fireButton, asteroids, explosions, shields, scoreText, gameOver;

var bulletTimer = 0;
var score = 0;

var ACCELERATION = 1000;
var DRAG = 400;
var MAXSPEED = 400;

function preload() {
  game.load.image("starfield", "assets/img/starfield.png");
  game.load.image("ship", "assets/img/EntD.png");
  game.load.image("bullet", "assets/img/plasma.png");
  game.load.image("asteroid", "assets/img/asteroid.png");
  game.load.image("shields", "assets/img/shields.png");
  game.load.spritesheet("explosion", "assets/img/explode.png", 128, 128);
}

function create() {
  starfield = game.add.tileSprite(0, 0, 800, 800, "starfield");

  player = game.add.sprite(400, 600, "ship");
  player.health = 2;
  player.anchor.setTo(0.5, 0.5);
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
  player.body.drag.setTo(DRAG, DRAG);
  player.body.collideWorldBounds = true;

  shields = game.add.sprite(-64, -90, "shields");
  player.addChild(shields);
  shields.health = 2;
  game.physics.enable(shields, Phaser.Physics.ARCADE);

  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(20, "bullet");
  bullets.setAll("anchor.x", 0.5);
  bullets.setAll("anchor.y", 2);
  bullets.setAll("outOfBoundsKill", true);
  bullets.setAll("checkWorldBounds", true);

  asteroids = game.add.group();
  asteroids.enableBody = true;
  asteroids.physicsBodyType = Phaser.Physics.ARCADE;
  asteroids.createMultiple(3, "asteroid");
  asteroids.setAll('anchor.x', 0.5);
  asteroids.setAll('anchor.y', 0.5);
  asteroids.setAll('scale.x', 0.5);
  asteroids.setAll('scale.y', 0.5);
  asteroids.setAll('angle', 180);
  asteroids.setAll("outOfBoundsKill", true);
  asteroids.setAll("checkWorldBounds", true);
  asteroids.forEach(function(enemy) {
    enemy.body.setSize(enemy.width * 3/4, enemy.height * 3/4);
    enemy.damageAmount = 2;
  });

  launchAsteroids();

  explosions = game.add.group();
  explosions.enableBody = true;
  explosions.physicsBodyType = Phaser.Physics.ARCADE;
  explosions.createMultiple(30, 'explosion');
  explosions.setAll('anchor.x', 0.5);
  explosions.setAll('anchor.y', 0.5);
  explosions.forEach(function(explosion) {
      explosion.animations.add('explosion');
  });

  shieldsText = game.add.text(game.world.width - 170, 730, 'SHIELDS: ' + shields.health + '%', {font: '20px Arial', fill: '#FFF'});
  shieldsText.render = function() {
    shieldsText.text = 'SHIELDS: ' + Math.max(shields.health, 0) + '%';
  };

  healthText = game.add.text(game.world.width - 247, 760, 'HULL INTEGRITY: ' + player.health + '%', {font: '20px Arial', fill: '#FFF'});
  healthText.render = function() {
    healthText.text = 'HULL INTEGRITY: ' + Math.max(player.health, 0) + '%';
  };

  scoreText = game.add.text(20, 760, 'XP: ' + score, {font: '20px Arial', fill: '#FFF'});
  scoreText.render = function() {
    scoreText.text = 'XP: ' + score;
  };

  gameOver = game.add.text(game.world.centerX, game.world.centerY, "GAME OVER", {font: '60px Arial', fill: '#FFF'});
  gameOver.alpha = 0;
  gameOver.anchor.setTo(0.5, 0.5);
  gameOver.visible = false;


  W = game.input.keyboard.addKey(Phaser.Keyboard.W);
  A = game.input.keyboard.addKey(Phaser.Keyboard.A);
  S = game.input.keyboard.addKey(Phaser.Keyboard.S);
  D = game.input.keyboard.addKey(Phaser.Keyboard.D);
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update() {
  starfield.tilePosition.y += 1;

  player.body.acceleration.setTo(0, 0);

// Cursors
  if (A.isDown) {
    player.body.acceleration.x = -ACCELERATION;
  } else if (D.isDown) {
    player.body.acceleration.x = ACCELERATION;
  }

  if (W.isDown) {
    player.body.acceleration.y = -ACCELERATION;
  } else if (S.isDown) {
    player.body.acceleration.y = ACCELERATION;
  }

  if (player.alive && fireButton.isDown) {
    fireBullet();
  }

// Banking
  bank = player.body.velocity.x / MAXSPEED * 0.35;
  player.scale.x = 1 - Math.abs(bank) / 5;
  player.angle = bank * 7;

  game.physics.arcade.overlap(shields, asteroids, shieldsCollide, null, this);
  game.physics.arcade.overlap(player, asteroids, shipCollide, null, this);
  game.physics.arcade.overlap(asteroids, bullets, hitEnemy, null, this);

  if(!player.alive && gameOver.visible === false) {
    gameOver.visible = true;

    var fadeIn = game.add.tween(gameOver);
    fadeIn.to({alpha: 1}, 8000, Phaser.Easing.Quintic.Out);
    fadeIn.onComplete.add(setResetHandlers);
    fadeIn.start();

    function setResetHandlers() {
      spaceRestart = fireButton.onDown.addOnce(_restart, this);
      function _restart() {
        spaceRestart.detach();
        restart();
      }
    }
  }
}

function render() {

}

function fireBullet() {

  if (game.time.now > bulletTimer) {
    var BULLET_SPEED = 400;
    var BULLET_SPACING = 200;
    var bullet = bullets.getFirstExists(false);

    if (bullet) {
      var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
      bullet.reset(player.x + bulletOffset, player.y);
      bullet.angle = player.angle;
      game.physics.arcade.velocityFromAngle(bullet.angle - 90, BULLET_SPEED, bullet.body.velocity);
      bullet.body.velocity.x += player.body.velocity.x;

      bulletTimer = game.time.now + BULLET_SPACING;
    }
  }
}

function launchAsteroids() {
  var MIN_SPACING = 300;
  var MAX_SPACING = 2000;
  var SPEED = 100;
  var enemy = asteroids.getFirstExists(false);

  if (enemy) {
    enemy.reset(game.rnd.integerInRange(0, game.width), 0);
    enemy.body.velocity.y = SPEED;
    enemy.body.drag.x = 100;

    enemy.update = function () {
      enemy.angle += 1;
    }
  }

  game.time.events.add(game.rnd.integerInRange(MIN_SPACING, MAX_SPACING), launchAsteroids);
}

function shipCollide(player, enemy) {
  var explosion = explosions.getFirstExists(false);
  explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
    explosion.body.velocity.y = enemy.body.velocity.y;
  explosion.alpha = 0.7;
  explosion.play('explosion', 30, false, true);
  enemy.kill();

  player.damage(enemy.damageAmount);
  healthText.render();

  if(player.health === 0) {
    player.kill();
  }

}

function shieldsCollide(shields, enemy) {
  var explosion = explosions.getFirstExists(false);
  explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
    explosion.body.velocity.y = enemy.body.velocity.y;
  explosion.alpha = 0.7;
  explosion.play('explosion', 30, false, true);
  enemy.kill();

  shields.damage(enemy.damageAmount);
  shields.alpha -= 0.015;
  shieldsText.render();

  if(shields.health === 0) {
    shields.kill();
  }

}

function hitEnemy(enemy, bullet) {
  var explosion = explosions.getFirstExists(false);
  explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
  explosion.body.velocity.y = enemy.body.velocity.y;
  explosion.alpha = 0.7;
  explosion.play('explosion', 30, false, true);
  enemy.kill();
  bullet.kill();

  score += enemy.damageAmount * 5;
  scoreText.render();
}

function restart() {
  asteroids.callAll('kill');

  player.revive();
  shields.revive();
  player.health = 100;
  shields.health = 100;
  score = 0;
  shieldsText.render();
  healthText.render();
  scoreText.render();

  player.x = 400;
  player.y = 600;

  gameOver.visible = false;
}
