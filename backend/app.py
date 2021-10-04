from flask import Flask, request, jsonify

app = Flask(__name__)

API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/"
PORT = 4001

@app.route("/getmeaning", methods=["GET"])
def get_meaning():
    inp = request.get_json()

    return jsonify({})

if __name__ == "__main__":
    app.run(debug=True, port=PORT)