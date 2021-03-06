import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "server",
      text: [
        "/help - About Bot",
        "/exm <word> - Example for word(s)",
        "/syn <word> - Synonyms of word(s)",
        "/ant <word> - Antonyms of word(s)",
      ],
      type: "initial",
      word: "This is a Dictionary bot",
    },
  ]);

  const dummy = useRef();

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const MessageElement = ({ sender, text, type, word }) => {
    if (sender === "server") {
      if (type === "synonyms" || type === "antonyms") {
        return (
          <div className={`MsgElement Msg${type} Msg${sender} `}>
            <h3>{word}</h3>
            <h4>{type}</h4>
            {text.map((t, k) => (
              <p key={k}>
                {k + 1}. {t}
              </p>
            ))}
          </div>
        );
      } else if (type === "example") {
        return (
          <div className={`MsgElement Msg${type} Msg${sender} `}>
            <h3>{word}</h3>
            <h4>{type}</h4>
            {text.map((t, k) => (
              <p key={k} style={{ marginBottom: "5px", marginTop: "5px" }}>
                {k + 1}. {t}
              </p>
            ))}
          </div>
        );
      } else if (type === "initial") {
        return (
          <div className={`MsgElement Msg${type} Msg${sender}`}>
            <h3>{word}</h3>
            <h4>Commands</h4>
            {text.map((t, k) => (
              <p className="code" key={k}>
                {t}
              </p>
            ))}
          </div>
        );
      } else if (type === "Help") {
        return (
          <div className={`MsgElement Msg${type} Msg${sender}`}>
            <h4>Help</h4> <br />
            <p>Hi, I am a dictionary bot. Ill give information about words.</p>
            <p>Type a word to get its definition.</p>
            <br />
            <p>These are the possible commands</p>
            <br />
            {text.map((t, k) => (
              <p className="code" key={k}>
                {t}
              </p>
            ))}
          </div>
        );
      }

      return (
        <div className={`MsgElement Msg${type} Msg${sender}`}>
          <h3>{word}</h3>
          <h4>{type}</h4>
          <p>{text}</p>
        </div>
      );
    }
    return (
      <div className={`MsgElement Msg${type} Msg${sender}`}>
        <p>{text}</p>
      </div>
    );
  };

  const getResult = async () => {
    fetch("https://dictionary-flask.herokuapp.com/getdata", {
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
        <div className="chatHeader">
          <h2>Dictionary Bot</h2>
        </div>
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
          <span ref={dummy}></span>
        </div>
        <form
          className="chatControls"
          onSubmit={(e) => {
            e.preventDefault();
            getResult();
            setMessages((arr) => [
              ...arr,
              { sender: "user", text: data, type: "input" },
            ]);
            setData("");
          }}
        >
          <input
            type="text"
            value={data}
            onChange={(e) => {
              setData(e.target.value);
            }}
            placeholder="Message"
          />
          <button type="submit">Search</button>
        </form>
      </div>
    </div>
  );
}

export default App;
