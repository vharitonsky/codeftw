import os

import tornado.ioloop
import tornado.web
from tornado import websocket
from tornado import autoreload
from tornado.template import Template,Loader

loader = Loader("./")

sockets = []

class MainHandler(tornado.web.RequestHandler):
    #
    def get(self):
        self.write(loader.load('tornadotest.html').generate(request = self.request))

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
        print "WebSocket closed!!!!!"

application = tornado.web.Application([
    (r"/",MainHandler),
    (r"/websocket",EchoWebSocket),
    (r"/feedparser/(.*)",tornado.web.StaticFileHandler,{'path':'./feedparser'}),
],static_path=os.path.join(os.path.dirname(__file__),'feedparser'))

if __name__ == "__main__":
    application.listen(8888)
    autoreload.watch('tornadotest.html')
    autoreload.start()
    tornado.ioloop.IOLoop.instance().start()
    
