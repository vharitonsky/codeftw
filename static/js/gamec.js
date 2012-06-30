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
            this.sprite(0, 0);
        }
        if(direction == DIRECTIONS[Crafty.keys.DOWN_ARROW]) {
            this.sprite(2, 0);
        }
        if(direction == DIRECTIONS[Crafty.keys.LEFT_ARROW]) {
            this.sprite(3, 0);
        }
        if(direction == DIRECTIONS[Crafty.keys.RIGHT_ARROW]) {
            this.sprite(1, 0);
        }
        return this;
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
            if (this.direction != DIRECTIONS[e.keyCode]) {
                this.rotating  = true;
                this.direction = DIRECTIONS[e.keyCode];
            } else {
                this.moving = true;
            }
        })
        .bind('KeyUp', function(e) {
            this.moving = this.rotating = false;
        })
        .bind('EnterFrame', function(e) {
            if (this.rotating) {
                this.rotate(this.direction);
                this.game.firePlayerRotateEvent(this, this.direction);
            }
            if (this.moving) {
                this.move(this.x, this.y, this.direction);
                this.game.firePlayerMoveEvent(this, this.direction);
            }
            this.moving = this.rotating = false;
        });
    }
});