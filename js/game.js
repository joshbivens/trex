var game = new Phaser.Game(
  750, 900,
  Phaser.AUTO,
  "game",
  {
    preload: preload,
    create: create,
    update: update,
    render: render
  }
);

var player, starfield, cursors;

var ACCELERATION = 2000;
var DRAG = 600;
var MAXSPEED = 400;

function preload() {
  game.load.image("starfield", "assets/img/starfield.png");
  game.load.image("ship", "assets/img/starship.png");
}

function create() {
  starfield = game.add.tileSprite(0, 0, 750, 900, "starfield");
  player = game.add.sprite(375, 780, "ship");

  player.anchor.setTo(0.5, 0.5);
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
  player.body.drag.setTo(DRAG, DRAG);

  cursors = game.input.keyboard.createCursorKeys();
}

function update() {
  starfield.tilePosition.y += 0.5;

  player.body.acceleration.setTo(0, 0);

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
}

function render() {

}
