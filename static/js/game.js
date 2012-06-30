function ServerEventDispatcher() {
    this._handlers = {
    };
}
ServerEventDispatcher.prototype.registerHandler = function(type, handler) {
    this._handlers[type] = handler;
}
ServerEventDispatcher.prototype.dispatch = function(event) {
    for (key in this._handlers) {
        this._handlers[key].dispatchSocketEvent(event);
    }
}

function Game(socket) {
    this.options = {
    };
    this.players = {
    };
    this.socket = socket;
}

Game.prototype.dispatchSocketEvent = function(event) {
    if (!$.isArray(event)) {
        event = [event];
    }
    
    for (var i = 0; i < event.length; i++) {
        console.log(event[i]);
        if (event[i].game) {
            this[event[i].cmd].apply(this, event[i].args);
        } else {
            console.log(this.players);

            if (event[i].player) {
                this.players[event[i].player][event[i].cmd].apply(this.players[event[i].player], event[i].args);
            }
        }
    }
}

Game.prototype.firePlayerMoveEvent = function(player, direction) {
    this.socket.send(JSON.stringify({
        player : player.name,

        cmd: 'move',
        
        args: [player.x, player.y, direction]
    }));
}

Game.prototype.init = function(options) {
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

Game.prototype.create_player = function(name, x, y) {
    console.log('player: ' + name + ' x:' + x + ' y:' + y);
    this.players[name] = Crafty.e("2D, Canvas, Player, ship").attr({
        game: this,

        name : name,

        x : x,
        y : y,

        moving : null,

        xspeed: this.options.user.speed,
        yspeed: this.options.user.speed
    });
    return this.players[name];
}

Game.prototype.create_others = function(name, x, y) {
    console.log('others: ' + name + ' x:' + x + ' y:' + y);
    this.players[name] = Crafty.e("2D, Canvas, Others, ship").attr({
        game: this,

        name : name,

        x : x,
        y : y,

        moving : null,

        xspeed: this.options.user.speed,
        yspeed: this.options.user.speed
    });
    return this.players[name];
}

Game.prototype.remove = function(name) {
    this.players[name].destroy();
    
    delete this.players[name];
}

$(function() {
    var gameInstance = new Game();
        gameInstance.init({
            size : [640, 640],
            tile : 64,

            user : {
                speed : 10
            },
            onGameLoaded : function(game) {
                var serverEventDispatcher = new ServerEventDispatcher();
                    serverEventDispatcher.registerHandler('game',  game);

                game.socket = socket = new WebSocket(ws_url);

                socket.onmessage = function(event) {
                    serverEventDispatcher.dispatch(JSON.parse(event.data));
                };
            }
        });
});