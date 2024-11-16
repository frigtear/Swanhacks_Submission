from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

current_image = "happy_meep.jpg"  # current image state
controller_sid = None             # track controller WH


@app.route('/')
def controller():
    return render_template('controller.html')


@app.route('/client')
def client():
    return render_template('client.html')

# SocketIO event to handle image change
@socketio.on('change_image')
def handle_change_image(data):
    global current_image
    current_image = data['image']  # Update the current image
    emit('update_image', {'image': current_image}, broadcast=True)  # Broadcast to all clients


if __name__ == '__main__':
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True)
