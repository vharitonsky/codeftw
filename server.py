import os

import tornado.ioloop
import tornado.web
from tornado import websocket
from tornado import autoreload
from tornado.template import Template,Loader
from tornado.options import define,parse_command_line,options

define(name = 'port', type='int', default='8888', help='run server on designated port')
define(name = 'host', type='str', default='127.0.0.1', help = 'host the application is running on')


sockets = []

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        ws_url = 'ws://%(host)s:%(port)s' % options
        self.render('index.html',ws_url = ws_url)

class EchoWebSocket(websocket.WebSocketHandler):
    def open(self):
        sockets.append(self)
        print "WebSocket opened %s" % self

    def on_message(self, message):
       for socket in sockets:
           if socket == self:
                   continue
           socket.write_message(message)

    def on_close(self):
        print "WebSocket closed %s" % self

application = tornado.web.Application([
    (r"/",MainHandler),
    (r"/websocket",EchoWebSocket),
    (r"/media/(.*)",tornado.web.StaticFileHandler,{'path':'./media'}),
],static_path = os.path.join(os.path.dirname(__file__),'media')
 ,template_path = os.path.join(os.path.dirname(__file__),'templates')
 ,debug = True)

if __name__ == "__main__":
    parse_command_line()
    application.listen(options.port)
    autoreload.start()
    tornado.ioloop.IOLoop.instance().start()
    
