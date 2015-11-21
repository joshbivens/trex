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

var player, starfield, cursors, bank, bullet, fireButton;

var bulletTimer = 0;

var ACCELERATION = 1000;
var DRAG = 400;
var MAXSPEED = 400;

function preload() {
  game.load.image("starfield", "assets/img/starfield.png");
  game.load.image("ship", "assets/img/spaceship.png");
  game.load.image("bullet", "assets/img/plasma.png");
}

function create() {
  starfield = game.add.tileSprite(0, 0, 800, 800, "starfield");

  player = game.add.sprite(400, 700, "ship");
  player.anchor.setTo(0.5, 0.5);
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
  player.body.drag.setTo(DRAG, DRAG);
  player.body.collideWorldBounds = true;

  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(20, "bullet");
  bullets.setAll("anchor.x", 0.5);
  bullets.setAll("anchor.y", 1);
  bullets.setAll("outOfBoundsKill", true);
  bullets.setAll("checkWorldBounds", true);

  W = game.input.keyboard.addKey(Phaser.Keyboard.W);
  A = game.input.keyboard.addKey(Phaser.Keyboard.A);
  S = game.input.keyboard.addKey(Phaser.Keyboard.S);
  D = game.input.keyboard.addKey(Phaser.Keyboard.D);
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update() {
  starfield.tilePosition.y += 2;

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

  if (fireButton.isDown) {
    fireBullet();
  }

// Banking
  bank = player.body.velocity.x / MAXSPEED * 0.35;
  player.scale.x = 1 - Math.abs(bank) / 5;
  player.angle = bank * 7;
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
