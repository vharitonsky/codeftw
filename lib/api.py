import json
from datetime import timedelta

class Command(object):

    def __call__(self):
        self._timeout()

class MoveCommand(Command):

    direction = ''

    def __init__(self, player, direction, socket, loop):

        def _timeout():
            socket.timeout += 500
            loop.add_timeout(timedelta(milliseconds = socket.timeout), self._method)
        self._timeout = _timeout

        def _method():
            rotate_msg = json.dumps({'cmd':'rotate', 'player':player, 'args' : [self.direction]})
            socket.on_message(rotate_msg, include_self = True)
            move_message = json.dumps({'cmd':'move', 'player':player, 'args':[0, 0, self.direction]})
            socket.on_message(move_message, include_self = True)
        self._method = _method


class Shoot(Command):

    def __init__(self, player, direction, socket, loop):

        def _timeout():
            socket.timeout += 500
            loop.add_timeout(timedelta(milliseconds = socket.timeout), self._method)
        self._timeout = _timeout

        def _method():
            if player not in socket.application.battlefield.players:
                return False
            x, y, direction, score = socket.application.battlefield.players[player]
            shoot_message = json.dumps({'cmd':'shoot', 'player':player, 'args':[direction]})
            socket.on_message(shoot_message, include_self = True)

        self._method = _method


class MoveLeft(MoveCommand):
    direction = 'left'

class MoveUp(MoveCommand):
    direction = 'up'

class MoveRight(MoveCommand):
    direction = 'right'

class MoveDown(MoveCommand):
    direction = 'down'

