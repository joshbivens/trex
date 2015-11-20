var game = new Phaser.Game(
  750, 1334,
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

function preload() {
  game.load.image("starfield", "assets/img/starfield.png");
  game.load.image("ship", "assets/img/starship.png");
}

function create() {
  starfield = game.add.tileSprite(0, 0, 750, 1334, "starfield");
  player = game.add.sprite(375, 1180, "ship");
  player.anchor.setTo(0.5, 0.5);
  game.physics.enable(player, Phaser.Physics.ARCADE);
  cursors = game.input.keyboard.createCursorKeys();
}

function update() {
  starfield.tilePosition.y += 0.5;

  player.body.velocity.setTo(0, 0);
  if (cursors.left.isDown) {
    player.body.velocity.x = -300;
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 300;
  }

  if (cursors.up.isDown) {
    player.body.velocity.y = -300;
  } else if (cursors.down.isDown) {
    player.body.velocity.y = 300;
  }
}

function render() {

}
