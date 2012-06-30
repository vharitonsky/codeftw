DIRECTIONS = {
}
DIRECTIONS[Crafty.keys.UP_ARROW]    = 'up';
DIRECTIONS[Crafty.keys.DOWN_ARROW]  = 'down';
DIRECTIONS[Crafty.keys.LEFT_ARROW]  = 'left';
DIRECTIONS[Crafty.keys.RIGHT_ARROW] = 'right';

Crafty.c("PlayerControls", {
    move : function(x, y, direction) {
        if(this.isAnimated)
            return
        
        this.isAnimated = true
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
})

Crafty.c("Others", {
    init : function() {
        this.requires('Collision, PlayerControls, Tween')
        .bind('TweenEnd', function() {
            this.isAnimated = false
            var event = this.pullEvent();
            if (event) {
                this[event.cmd].apply(this, event.args);
            }
        });
    },

    hasEvents : function() {
        return this.queue.length > 0;
    },

    pushEvent : function(event) {
        console.log('push event');
        return this.queue.push(event);
    },

    pullEvent : function() {
        console.log('pull event');
        return this.queue.shift();
    }
});

Crafty.c("Player", {
    init : function() {
        this.requires("2D, Controls, Collision, PlayerControls, Tween")
        .bind('KeyDown', function(e) {
            if (!this.moving) {
                switch (e.keyCode) {
                    case Crafty.keys.UP_ARROW:
                    case Crafty.keys.DOWN_ARROW:
                    case Crafty.keys.LEFT_ARROW:
                    case Crafty.keys.RIGHT_ARROW:
                        this.direction = this.moving = DIRECTIONS[e.keyCode];
                        break;
                }
            }
        })
        .bind('KeyUp', function(e) {
            this.moving = null;
        })
        .bind('EnterFrame', function(e) {
            if (this.moving) {
                this.move(this.x, this.y, this.moving);
            }
        })
        .bind('TweenEnd', function() {
            console.log('Tween end')
            this.isAnimated=false
            this.game.firePlayerMoveEvent(this, this.direction);
        });
        return this;
    }
});