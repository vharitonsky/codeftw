DIRECTIONS = {
}
DIRECTIONS[Crafty.keys.UP_ARROW]    = 'up';
DIRECTIONS[Crafty.keys.DOWN_ARROW]  = 'down';
DIRECTIONS[Crafty.keys.LEFT_ARROW]  = 'left';
DIRECTIONS[Crafty.keys.RIGHT_ARROW] = 'right';

Crafty.c("Others", {
    init : function() {
        this.requires("Tween");
    },

    move : function(x, y, direction) {
        switch (direction) {
            case 'up':
                this.tween({y : this.y - 20}, 5);
                break;
            case 'down':
                this.tween({y : this.y + 20}, 5);
                break;
            case 'left':
                this.tween({x : this.x - 20}, 5);
                break;
            case 'right':
                this.tween({x : this.x + 20}, 5);
                break;
        }
        return this;
    }
});

Crafty.c("Player", {
    init : function() {
        this.requires("Controls, Collision, Others")
        .bind('KeyDown', function(e) {
            if (!this.moving) {
                switch (e.keyCode) {
                    case Crafty.keys.UP_ARROW:
                    case Crafty.keys.DOWN_ARROW:
                    case Crafty.keys.LEFT_ARROW:
                    case Crafty.keys.RIGHT_ARROW:
                        this.moving = DIRECTIONS[e.keyCode];
                        break;
                }
            }
        })
        .bind('KeyUp', function(e) {
            this.moving = null;
        })
        .bind('EnterFrame', function(e) {
            if (this.moving) {
                this.game.firePlayerMoveEvent(this, this.moving);
                
                this.move(this.x, this.y, this.moving);
            }
        });
        return this;
    }
});