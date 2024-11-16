from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

# Variable to hold the current image state
current_image = "image1.jpg"


@app.route('/')
def index():
    return render_template('teacher.html')


@app.route('/viewer')
def viewer():
    return render_template('student.html')

# SocketIO event to handle image change
@socketio.on('change_image')
def handle_change_image(data):
    global current_image
    current_image = data['image']  # Update the current image
    emit('update_image', {'image': current_image}, broadcast=True)  # Broadcast to all clients


if __name__ == '__main__':
    socketio.run(app, debug=True)
