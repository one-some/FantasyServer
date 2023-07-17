from flask import Flask

import ai

HOSTNAME = "localhost"
PORT = 1338

app = Flask(__name__)

@app.route("/gen/", defaults={"path": ""})
@app.route("/gen/<path:path>")
def most(path):
    # TODO: Is this better for prompting?
    path = "/" + path
    out = ai.get_ai_response(path)
    return out

app.run(host=HOSTNAME, port=PORT)
