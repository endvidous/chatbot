// eslint-disable-next-line no-unused-vars
import React, { useRef, useState } from "react";
import "./chatbot.css";
import data from "../data/data.json";

const Chatbot = () => {
  const textareaRef = useRef(null);
  const chatbox = useRef(null);
  const [visibleBot, setVisibleBot] = useState(false);
  const [initialMessage, setInitialMessageShown] = useState(false);
  let userMessage;

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `55px`;
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleclick = () => {
    userMessage = textareaRef.current.value.trim();
    handlechat();
    textareaRef.value = "";
  };

  const keypressed = (event) => {
    if (event.key === "Enter" && event.shiftKey) {
      return;
    } else if (event.key === "Enter") {
      event.preventDefault();
      userMessage = event.target.value.trim();
      handlechat();
      event.target.value = "";
    }
  };

  const toggleView = () => {
    setVisibleBot((prevVisible) => !prevVisible);

    if (!initialMessage) {
      const ID = 1;
      const incomingChatLi = createChatLi("Thinking....", "incoming");
      chatbox.current.appendChild(incomingChatLi);
      generateResponse(incomingChatLi, ID);
      setInitialMessageShown(true);
    }
  };

  const handlechat = () => {
    if (!userMessage) return;

    chatbox.current.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.current.scrollTop = chatbox.current.scrollHeight;
    setTimeout(() => {
      const incomingChatLi = createChatLi("Thinking....", "incoming");
      chatbox.current.appendChild(incomingChatLi);
      generateResponse(incomingChatLi);
    }, 600);
  };

  const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);

    let chatContent =
      className === "outgoing"
        ? `<div class="text">
            <p></p>
          </div>`
        : `<span class='material-symbols-outlined'>smart_toy</span>
          <div class='text'>
            <p></p>
          </div>`;

    chatLi.innerHTML = chatContent;
    const textContainer = chatLi.querySelector(".text");

    if (textContainer) {
      textContainer.querySelector("p").textContent = message;
    } else {
      console.error("Error: textContainer not found");
    }

    return chatLi;
  };

  const generateResponse = (incomingChatLi, ID) => {
    chatbox.current.scrollTop = chatbox.current.scrollHeight;
    const id_value = parseInt(ID, 10);
    const info = findMessageByID(id_value);

    setTimeout(() => {
      if (isNaN(id_value)) {
        const textContainer = incomingChatLi.querySelector(".text");

        const messageText = incomingChatLi.querySelector(".text p");

        messageText.textContent = "There is some error please wait";
        textContainer.appendChild(messageText);
        return;
      }

      if (info) {
        const textContainer = incomingChatLi.querySelector(".text");
        const buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("buttons");

        const messageText = incomingChatLi.querySelector(".text p");

        messageText.textContent = info.text;
        textContainer.appendChild(messageText);

        if (info.buttons && info.buttons.length > 0) {
          info.buttons.forEach((buttonInfo) => {
            const button = document.createElement("button");
            button.textContent = buttonInfo.text;

            button.value = buttonInfo.value;
            button.addEventListener("click", (e) => {
              handleButtonEvent(e.target);
            });
            buttonsContainer.appendChild(button);
          });

          textContainer.appendChild(buttonsContainer);
        }
      } else {
        console.error(`Error: Message with ID ${ID} not found`);
      }
    }, 1000);
    chatbox.current.scrollTop = chatbox.current.scrollHeight;
  };

  const handleButtonEvent = (button) => {
    const newChatLi = createChatLi(button.textContent, "outgoing");
    chatbox.current.appendChild(newChatLi);
    const incomingChatLi = createChatLi("Thinking....", "incoming");
    chatbox.current.appendChild(incomingChatLi);
    generateResponse(incomingChatLi, button.value);
  };

  const findMessageByID = (id) => {
    return data.find((data) => data.id === id);
  };

  return (
    <div className={visibleBot ? "show-chatbot" : ""}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
      />
      <button className="chatbot-toggler" onClick={toggleView}>
        <span className="material-symbols-outlined">mode_comment</span>
        <span className="material-symbols-outlined">close</span>
      </button>
      <div className="chatbot">
        <header>
          <h1>Chat Bot </h1>
          <span className="material-symbols-outlined" onClick={toggleView}>
            close
          </span>
        </header>

        <ul className="chatbox" ref={chatbox}></ul>

        <div className="chat-input">
          <textarea
            placeholder="Enter your message...."
            required
            ref={textareaRef}
            onKeyDown={keypressed}
            onChange={adjustTextareaHeight}
          ></textarea>
          <span className="material-symbols-outlined" onClick={handleclick}>
            send
          </span>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
