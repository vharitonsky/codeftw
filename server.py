import os
import json
from datetime import timedelta

import tornado.ioloop
from tornado.web import Application, RequestHandler, StaticFileHandler
from tornado import websocket
from tornado import gen
from tornado.template import Template, Loader
from tornado.options import define, parse_command_line, options
from lib.field import BattleField

from lib.nicepass import nicepass as random_name

define(name = 'port', type = int, default = '8888', help = 'run server on designated port')
define(name = 'host', type = str, default = '127.0.0.1', help = 'host the application is running on')




class MainHandler(tornado.web.RequestHandler):

    def get(self):
        ws_url = 'ws://%(host)s:%(port)s/websocket' % {'host':options.host, 'port':options.port}
        self.render('index.html', ws_url = ws_url)

class DebugHandler(MainHandler):
    def get(self):
        ws_url = 'ws://%(host)s:%(port)s/websocket' % {'host':options.host, 'port':options.port}
        self.render('debug.html', ws_url = ws_url)

class GameWebSocket(websocket.WebSocketHandler):

    name = None

    def write_message(self, message):
        message = json.dumps(message)
        super(GameWebSocket, self).write_message(message)

    def open(self):
        self.name = random_name()
        while self.name in self.application.sockets:
            self.name = random_name()
        self.application.sockets[self.name] = self
        x, y = self.application.battlefield.add_player(self.name)
        message = {'cmd':'create_others', 'game':True, 'args':[self.name, x, y, 'up']}
        all_messages = [{'cmd':'create_player', 'game':True, 'args':[self.name, x, y, 'up']}]
        for player_name, player_pos in self.application.battlefield.get_players():
            if player_name != self.name:
                all_messages.append({'cmd':'create_others', 'game':True, 'args':[player_name, player_pos[0], player_pos[1], player_pos[2]]})
        for coords, obstacle_type in self.application.battlefield.get_obstacles().items():
            all_messages.append({'cmd':'create_obstacle', 'game':True, 'args':coords + (obstacle_type,)})
        self.write_message(all_messages)
        self.broadcast(message)
        print "WebSocket opened %s" % self.name

    def broadcast(self, message):
        for name, socket in self.application.sockets.items():
            if socket.ws_connection is None or name == self.name:
                continue
            socket.write_message(message)

    def on_message(self, message):
        message = json.loads(message)
        results = getattr(self, 'handle_%s' % message['cmd'], lambda x:None)(message)
        if results:
            self.broadcast(message)

    def on_close(self):
        print "WebSocket closed %s" % self.name
        self.application.battlefield.remove_player(self.name)
        del self.application.sockets[self.name]
        self.broadcast({'cmd':'remove', 'game':True, 'args' : [self.name]})

    def handle_move(self, message):
        x, y, direction = message['args']
        return self.application.battlefield.move_player(self.name, x, y, direction)

    def handle_rotate(self, message):
        return self.application.battlefield.rotate_player(self.name, message['args'][0])


    def handle_shoot(self, message):
        player = message['player']
        shot_player = self.application.battlefield.calculate_shot(player)
        if shot_player:
            self.application.battlefield.inc_score(player)
            score = self.application.battlefield.remove_player(shot_player)
            self.write_message({'cmd':'kill', 'game':True, 'args' : [shot_player, application.battlefield.get_score()]})
            self.broadcast({'cmd':'kill', 'game':True, 'args' : [shot_player, application.battlefield.get_score()]})

            def respawn():
                self.respawn(shot_player, score)

            def timeout():
                ioloop.add_timeout(timedelta(seconds = 3), respawn)

            ioloop.add_callback(timeout)
        return True


    def respawn(self, shot_player, score):
        x, y = self.application.battlefield.add_player(shot_player, score = score)
        for name, socket in self.application.sockets.items():
            if name == shot_player:
                message = {'cmd':'create_player', 'game':True, 'args':[shot_player, x, y, 'up']}
            else:
                message = {'cmd':'create_others', 'game':True, 'args':[shot_player, x, y, 'up']}
            socket.write_message(message)


class GameApplication(Application):

    def __init__(self):
        handlers = [
            (r"/", MainHandler),
            (r"/debug", DebugHandler),
            (r"/websocket", GameWebSocket),
            (r"/static/(.*)", StaticFileHandler, {'path':'./static'}),
        ]
        settings = dict(static_path = os.path.join(os.path.dirname(__file__), 'static'),
                        template_path = os.path.join(os.path.dirname(__file__), 'templates'),
                        debug = True)
        self.battlefield = BattleField(600, 600, 40)
        self.battlefield.generate_obstacles()
        self.sockets = {}
        super(GameApplication, self).__init__(handlers, **settings)

application = GameApplication()

if __name__ == "__main__":
    parse_command_line()
    application.listen(options.port)
    ioloop = tornado.ioloop.IOLoop.instance()
    ioloop.start()

