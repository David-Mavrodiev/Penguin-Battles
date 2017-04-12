/**
 * Created by Jerome on 03-03-16.
 */
//noinspection JSCheckFunctionSignatures,JSCheckFunctionSignatures,JSCheckFunctionSignatures
var game = new Phaser.Game(27*30, 20*30, Phaser.AUTO, document.getElementById('game'));
game.state.add('Game',Game);
game.state.start('Game');