function Game() {
    this._players = {
    };
}

Game.prototype.init = function(canvas, options) {
    Crafty.init(canvas);
            //.canvas.init();
    console.log('inited...');
}

$(function() {
    var gameInstance = new Game();
        gameInstance.init($('#canvas').get(0), {
            size : [640, 640]
        });
});