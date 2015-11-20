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

var player, starfield, cursors, bank;

var ACCELERATION = 1000;
var DRAG = 400;
var MAXSPEED = 400;

function preload() {
  game.load.image("starfield", "assets/img/starfield.png");
  game.load.image("ship", "assets/img/starship.png");
}

function create() {
  starfield = game.add.tileSprite(0, 0, 800, 800, "starfield");
  player = game.add.sprite(400, 700, "ship");

  player.anchor.setTo(0.5, 0.5);
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
  player.body.drag.setTo(DRAG, DRAG);
  player.body.collideWorldBounds = true;

  cursors = game.input.keyboard.createCursorKeys();
}

function update() {
  starfield.tilePosition.y += 2;

  player.body.acceleration.setTo(0, 0);

// Cursors
  if (cursors.left.isDown) {
    player.body.acceleration.x = -ACCELERATION;
  } else if (cursors.right.isDown) {
    player.body.acceleration.x = ACCELERATION;
  }

  if (cursors.up.isDown) {
    player.body.acceleration.y = -ACCELERATION;
  } else if (cursors.down.isDown) {
    player.body.acceleration.y = ACCELERATION;
  }

// Banking
  bank = player.body.velocity.x / MAXSPEED * 0.35;
  player.scale.x = 1 - Math.abs(bank) / 5;
  player.angle = bank * 10;
}

function render() {

}
