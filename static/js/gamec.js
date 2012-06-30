DIRECTIONS = {
}
DIRECTIONS[Crafty.keys.UP_ARROW]    = 'up';
DIRECTIONS[Crafty.keys.DOWN_ARROW]  = 'down';
DIRECTIONS[Crafty.keys.LEFT_ARROW]  = 'left';
DIRECTIONS[Crafty.keys.RIGHT_ARROW] = 'right';


Crafty.c("Player", {
    init : function() {
        this.requires("Controls, Collision, Tween")
        .bind('KeyDown', function(e) {
            if (!this.move) {
                switch (e.keyCode) {
                    case Crafty.keys.UP_ARROW:
                    case Crafty.keys.DOWN_ARROW:
                    case Crafty.keys.LEFT_ARROW:
                    case Crafty.keys.RIGHT_ARROW:
                        this.move = DIRECTIONS[e.keyCode];
                        break;
                }
            }
        })
        .bind('KeyUp', function(e) {
            this.move = null;
        })
        .bind('EnterFrame', function(e) {
            if (this.move) {
                switch (this.move) {
                    case 'up':
                        this.tween({y : this.y - 10}, 25);
                        break;
                    case 'down':
                        this.tween({y : this.y + 10}, 25);
                        break;
                    case 'left':
                        this.tween({x : this.x - 10}, 25);
                        break;
                    case 'right':
                        this.tween({x : this.x + 10}, 25);
                        break;
                }
            }            
        });
        return this;
    },

    move : function(direction) {
    }
});