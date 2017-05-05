from flask import Flask, request, jsonify
import socket
from time import time

app = Flask(__name__)
UDPSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
address = ('10.0.0.101',54321)

@app.route('/', methods = ['GET'])
def hello():
    global last_call
    if not 'msg' in request.args:
        return(jsonify(status= 'error',
                       message= 'Message to relay not found.'))
    msg = request.args['msg']
    UDPSock.sendto(msg, address)
    response = jsonify(status = 'success',
                       message = 'UDP message sent.')
    response.headers.add('Access-Control-Allow-Origin', '*')
    return(response)

if __name__ == '__main__':
    app.run()
