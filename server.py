import asyncio
import websockets
import json

dev_mode = False

unknown_connections = dict()
identified_connections = dict()
teacher_connection = None

lock = asyncio.Lock()

async def handle_connection(socket):
    global teacher_connection, unknown_connections, identified_connections

    try:
        if teacher_connection is None:
            teacher_connection = socket
            print(f"new teacher connection")
        else:
            print(f"New unidentified connection")

        async for message in socket:

            print(f"recieved {message}")

            try:
                message = json.loads(message)
            except json.JSONDecodeError:
                print(f"ERROR: message not valid json: {message}, skipping")
                continue
            
            if "Type" in message:
                type = message["Type"]
            else:
                print(f"ERROR: message has no found type: {message}, skipping")

            if type == "Identification" and "Name" in message:
                name = message["Name"]

                async with lock:
                    identified_connections[name] = socket 

                print(f"identified connection: {name}, address:")

            if type == "Order" and message["Student"] in identified_connections and socket == teacher_connection:
                student_name = message["Student"]
                await identified_connections[student_name].send(json.dumps(message))
                print(f"forwarded {message} to {student_name}")

            if type == "Student_Request":
                await socket.send(json.dumps(list(identified_connections.keys())))
                print(f"sent list of connected students")

    except websockets.ConnectionClosed:

        if socket == teacher_connection:
            teacher_connection = None
        else:
            name_to_disconnect = None

            for name, connection in identified_connections.items():
                if connection == socket:
                    name_to_disconnect = name

            if name_to_disconnect:
                async with lock:
                    del identified_connections[name_to_disconnect]
    

async def main():
    ip = "localhost"
    if not dev_mode:
        ip = "0.0.0.0"
    server = await websockets.serve(handle_connection, ip, 8080)
    print(f"WebSocket server started on ws://{ip}")
    await server.wait_closed()
                

asyncio.run(main())