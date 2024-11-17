from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)


@app.route('/')
def student():
    return render_template('student_test.html')


if __name__ == '__main__':
    socketio.run(app, debug=True)