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
        this.direction = direction
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
    },

    rotate : function(new_direction) {
        if(new_direction == 'left')
            this.sprite(3,0)
        if(new_direction == 'up')
            this.sprite(0,0)
        if(new_direction == 'down')
            this.sprite(2,0)
        if(new_direction == 'right')
            this.sprite(1,0)
    }
})

Crafty.c("Others", {
    init : function() {
        this.requires('Collision, Sprite, PlayerControls, Tween')
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
        this.requires("2D, Sprite, Controls, Collision, PlayerControls, Tween")
        .bind('KeyDown', function(e) {
            if (!this.moving) {
                this.moving = DIRECTIONS[e.keyCode];
                if (this.direction != DIRECTIONS[e.keyCode]) {
                        this.rotating = true
                        this.new_direction = DIRECTIONS[e.keyCode]
                }
                switch (e.keyCode) {
                    case Crafty.keys.UP_ARROW:
                    case Crafty.keys.DOWN_ARROW:
                    case Crafty.keys.LEFT_ARROW:
                    case Crafty.keys.RIGHT_ARROW:
                        break;
                }
            }
        })
        .bind('KeyUp', function(e) {
            this.moving = null;
        })
        .bind('EnterFrame', function(e) {
            if(this.rotating){
                this.rotate(this.new_direction);
                this.rotating = false;
                this.game.firePlayerRotateEvent(this, this.new_direction);
                return ;
            }
            if (this.moving) {
                this.move(this.x, this.y, this.moving);
            }
        })
        .bind('TweenEnd', function() {
            this.isAnimated = false
            this.game.firePlayerMoveEvent(this, this.direction);
        });
        return this;
    }
});