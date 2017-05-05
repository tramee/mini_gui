from flask import Flask, request
import socket
from time import time

app = Flask(__name__)
UDPSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
address = ('10.0.0.101',54321)
last_call = time()

@app.route('/', methods = ['GET'])
def hello():
    global last_call
    if not 'msg' in request.args:
        return('Error, wrong data.')
    msg = request.args['msg']
    # speed = '0'
    # speed = msg.split('V')[1]
    # speed, yaw = speed.split('Y')
    # # speed = msg.split('V')
    # return('Speed is {}, and yaw is {}.'.format(speed,yaw))
    UDPSock.sendto(msg, address)
    print ('Loop time: {}s.'.format(time() - last_call))
    last_call = time()
    return('Message Sent')

if __name__ == '__main__':
    app.run()
