import asyncio
import json
import websockets
from flask import Flask, render_template

app = Flask(__name__)

# Store connected clients
clients = set()

# Game state
game_state = {
    "blue": {"x": 0, "y": 0},
    "red": {"x": 0, "y": 0},
    "score": {"blue": 0, "red": 0}
}

async def websocket_handler(websocket, path):
    clients.add(websocket)
    try:
        async for message in websocket:
            data = json.loads(message)
            if data['type'] == 'move':
                game_state[data['player']] = {"x": data['x'], "y": data['y']}
            elif data['type'] == 'score':
                game_state['score'][data['player']] += 1
            
            # Broadcast updated game state to all clients
            await broadcast(json.dumps(game_state))
    finally:
        clients.remove(websocket)

async def broadcast(message):
    for client in clients:
        await client.send(message)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    import threading
    
    # Run Flask app in a separate thread
    flask_thread = threading.Thread(target=app.run, kwargs={'debug': True, 'use_reloader': False})
    flask_thread.start()
    
    # Run WebSocket server
    start_server = websockets.serve(websocket_handler, "localhost", 8765)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()