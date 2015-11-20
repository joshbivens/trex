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

var player, starfield;

function preload() {
  game.load.image("starfield", "assets/img/starfield.png");
  game.load.image("ship", "assets/img/ship.png");
}

function create() {
  starfield = game.add.tileSprite(0, 0, 750, 1334, "starfield");
  player = game.add.sprite(375, 1280, "ship");
  player.anchor.setTo(0.5, 0.5);
}

function update() {

}

function render() {
  
}
