DIRECTIONS = {
};
DIRECTIONS[Crafty.keys.UP_ARROW]    = 'up';
DIRECTIONS[Crafty.keys.DOWN_ARROW]  = 'down';
DIRECTIONS[Crafty.keys.LEFT_ARROW]  = 'left';
DIRECTIONS[Crafty.keys.RIGHT_ARROW] = 'right';

Crafty.c('PlayerControls', {
    move : function(x, y, direction) {
        if(direction == DIRECTIONS[Crafty.keys.UP_ARROW]) {
            this.y -= this.speed;
        }
        if(direction == DIRECTIONS[Crafty.keys.DOWN_ARROW]) {
            this.y += this.speed;
        }
        if(direction == DIRECTIONS[Crafty.keys.LEFT_ARROW]) {
            this.x -= this.speed;
        }
        if(direction == DIRECTIONS[Crafty.keys.RIGHT_ARROW]) {
            this.x += this.speed;
        }
        return true;
    },

    rotate : function(direction) {
        if(direction == DIRECTIONS[Crafty.keys.UP_ARROW]) {
            this.sprite(0, this.hero ? 0 : 1);
        }
        if(direction == DIRECTIONS[Crafty.keys.DOWN_ARROW]) {
            this.sprite(2, this.hero ? 0 : 1);
        }
        if(direction == DIRECTIONS[Crafty.keys.LEFT_ARROW]) {
            this.sprite(3, this.hero ? 0 : 1);
        }
        if(direction == DIRECTIONS[Crafty.keys.RIGHT_ARROW]) {
            this.sprite(1, this.hero ? 0 : 1);
        }
        return this;
    },

    shoot : function(direction) {
        var player = this;
        
        is_vertical_direction   = $.inArray(direction, [DIRECTIONS[Crafty.keys.UP_ARROW], DIRECTIONS[Crafty.keys.DOWN_ARROW]]) != -1;

        Crafty.audio.play("Blaster");
                
        Crafty.e("2D, DOM, Color, bullet")
        .attr({w : 0, h : 0, x : player._x + 20, y :  player._y + 20 })
        .color(this.hero ? "rgb(2, 68, 204)" : "rgb(255, 0, 0)")
        .bind("EnterFrame", function(e) {
            speed = 40;

            this.w = is_vertical_direction ? 5 : 20;
            this.h = is_vertical_direction ? 20 : 5;
            
            if(direction == DIRECTIONS[Crafty.keys.UP_ARROW]) {
                this.y -= speed;
            }
            if(direction == DIRECTIONS[Crafty.keys.DOWN_ARROW]) {
                this.y += speed;
            }
            if(direction == DIRECTIONS[Crafty.keys.LEFT_ARROW]) {
                this.x -= speed;
            }
            if(direction == DIRECTIONS[Crafty.keys.RIGHT_ARROW]) {
                this.x += speed;
            }
            if (!this.within(0, 0, Crafty.viewport.width, Crafty.viewport.height)) {
                this.destroy();
            }
        });
    }
});

Crafty.c('Others', {
    init : function() {
        this.requires("2D, Sprite, Collision, PlayerControls")
    }
})

Crafty.c('Player', {
    init : function() {
        this.requires("2D, Sprite, Controls, Collision, PlayerControls")
        .bind('KeyDown', function(e) {
            if (e.keyCode === Crafty.keys.SPACE) {
                this.shooting = true;
            } else {
                if (this.direction != DIRECTIONS[e.keyCode]) {
                    this.rotating  = true;
                    this.direction = DIRECTIONS[e.keyCode];
                } else {
                    this.moving = true;
                }
            }        
        })
        .bind('KeyUp', function(e) {
            this.moving = this.rotating = this.shooting = false;
        })
        .bind('EnterFrame', function(e) {
            if (this.rotating) {
                this.rotate(this.direction);
                this.game.firePlayerRotateEvent(this, this.direction);
            }
            if (this.moving) {
                var from = {x : this.x, y : this.y};
                this.move(this.x, this.y, this.direction);
                if (this.within(0, 0, Crafty.viewport.width, Crafty.viewport.height)) {
                    this.game.firePlayerMoveEvent(this, this.direction);
                } else {
                    this.attr({x: from.x, y: from.y});
                }
            }
            if (this.shooting) {
                this.shoot(this.direction);
                this.game.firePlayerShootEvent(this);
            }
            this.moving = this.rotating = this.shooting = false;
        });
    }
});