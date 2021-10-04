from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/"
PORT = 4001

def custom_get(rtype, data):
    for i in data:
        api_response = requests.get(API_URL+i).json()
            
        if "title" in api_response:
            res.append({"word": i, "error": "No definitions found", "type": "error"})
        else:
            word = api_response[0]["word"]
            cget = api_response[0]["meanings"][0]["definitions"][0][rtype]

            res.append({"word": word, rtype: cget, "type":rtype})



def send_request(data):
    global res
    res = []
    
    if data[0] == "word":
        custom_get("definition", data[1])
            
    elif data[0] == "command":
        cmd = data[1][0][1:len(data[1][0])]

        if cmd == "ant":
            custom_get("antonyms", data[1][1:])
        
        elif cmd == "ex":
            custom_get("example", data[1][1:])
        
        elif cmd == "syn":
            custom_get("synonyms", data[1][1:])
        
        else:
            res.append({"word": "", "error": "No such commands", "type":"error"})

    print(res)
    return res

def analyse_input(data):

    data = data["data"].split()

    itype = "word"

    if data[0][0] == "/":
        itype = "command"
    
    
    return [itype, data]



@app.route("/getdata", methods=["POST"])
def get_data():
    data = request.get_json()

    res = analyse_input(data)
    out = send_request(res)

    return jsonify({"data": out})

if __name__ == "__main__":
    app.run(debug=True, port=PORT)