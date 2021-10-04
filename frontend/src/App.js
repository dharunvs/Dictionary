import { useState } from "react";

function App() {
  const [data, setData] = useState("");
  const [messages, setMessages] = useState([]);

  const MessageElement = ({ sender, text, type, word }) => {
    if (sender === "server") {
      return (
        <div className={`MsgElement ${type}`}>
          <h1>{word}</h1>
          <h2>{type}</h2>
          <p>{text}</p>
        </div>
      );
    }
    return (
      <div className="MsgElement">
        <p>{text}</p>
      </div>
    );
  };

  const getResult = async () => {
    fetch("/getdata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res.data);
        res.data.forEach((d) => {
          setMessages((arr) => [
            ...arr,
            {
              sender: "server",
              text: d[d["type"]],
              type: d["type"],
              word: d["word"],
            },
          ]);
        });
      });
  };
  return (
    <div className="App">
      <div className="appWrapper">
        <div className="chatDisplay">
          {messages &&
            messages.map((msg, key) => (
              <MessageElement
                key={key}
                sender={msg["sender"]}
                type={msg["type"]}
                text={msg["text"]}
                word={msg["word"]}
              />
            ))}
        </div>
        <div className="chatControls">
          <input
            type="text"
            value={data}
            onChange={(e) => {
              setData(e.target.value);
            }}
          />
          <button
            onClick={() => {
              getResult();
              setMessages((arr) => [
                ...arr,
                { sender: "user", text: data, type: "input" },
              ]);
              setData("");
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
