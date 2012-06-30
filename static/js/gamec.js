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
        this.moved = true
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
        //if(this.isAnimated)
        //    return

        this.isAnimated = true
        this.direction = new_direction
        if(new_direction == 'left')
            this.sprite(3,0)
        if(new_direction == 'up')
            this.sprite(0,0)
        if(new_direction == 'down')
            this.sprite(2,0)
        if(new_direction == 'right')
            this.sprite(1,0)

        this.trigger('TweenEnd');
        return this;
    }
})

Crafty.c("Others", {
    init : function() {
        this.requires('Collision, Sprite, PlayerControls, Tween')
        .bind('TweenEnd', function() {
            console.log('x  xx')
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
                this.keyCode = e.keyCode
                this.moving = DIRECTIONS[e.keyCode];
                if (this.direction != DIRECTIONS[e.keyCode]) {
                        this.rotating = true
                        this.new_direction = DIRECTIONS[e.keyCode]
                }
            }else{
                this.next_move = DIRECTIONS[e.keyCode]
                this.next_move_key = e.keyCode
            }
        })
        .bind('KeyUp', function(e) {
            if(e.keyCode == this.keyCode){
                this.moving = null;
                if(this.next_move){
                    this.next_move = null
                    this.moving = DIRECTIONS[this.next_move_key]
                    this.keyCode = this.next_move_key
                    this.rotating = true
                    this.new_direction = DIRECTIONS[this.next_move_key]
                }
            }
            if(this.next_move && e.keyCode == this.next_move_key){
                this.next_move = null
            }
        })
        .bind('EnterFrame', function(e) {
            if(this.rotating){
                this.rotating = false
                this.game.firePlayerRotateEvent(this, this.new_direction);
                this.rotate(this.new_direction);

                return ;
            }
            if (this.moving) {
                this.move(this.x, this.y, this.moving);
            }
        })
        .bind('TweenEnd', function() {
            if(this.moved){
                console.log('tween end')
                this.moved = false
                this.game.firePlayerMoveEvent(this, this.direction);
            }
            this.isAnimated = false
        });
        return this;
    }
});