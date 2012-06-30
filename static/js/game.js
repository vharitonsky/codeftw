function Game() {
    this.options = {
    };
    this.players = {
    };
}

Game.prototype.init = function(canvas, options) {
    var game = this;
    
    $.extend(true, this.options, {
        resources : 'static/resources/',

        onGameLoaded : function(game) {}
    }, options);

    Crafty.init(this.options.size[0], this.options.size[1]).canvas.init();

    Crafty.scene('main', function() {
        Crafty.background("url('" + game.options.resources + "background.png')");

        console.log('loaded...');
        if ($.isFunction(game.options.onGameLoaded)) {
            game.options.onGameLoaded(game);
        }        
    });

    Crafty.scene('load', function() {
        Crafty.load([
            game.options.resources  + 'sprite.png'
        ], function() {
            Crafty.sprite(options.tile, game.options.resources  + 'sprite.png', {
                ship : [0, 0]
            });
            Crafty.scene('main');
        });
    });
    Crafty.scene('load');
}

Game.prototype.create = function(name, x, y) {
    var player = Crafty.e("2D, Canvas, Player, ship").attr({
        game: this,

        x : x,
        y : y,

        move : false,

        xspeed: this.options.user.speed,
        yspeed: this.options.user.speed
    });
    return player;
}

$(function() {
    var gameInstance = new Game();
        gameInstance.init($('#canvas').get(0), {
            size : [640, 640],
            tile : 64,

            user : {
                speed : 10
            },

            onGameLoaded : function(game) {
                player1 = game.create('player1', 0, 0);
            }
        });
});