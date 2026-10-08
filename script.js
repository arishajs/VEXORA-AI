
const API_URL = "http://localhost:5000/api/chat";

const chatArea = document.getElementById("chatArea");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const welcome = document.getElementById("welcome");

const newChatBtn = document.getElementById("newChatBtn");
const clearBtn = document.getElementById("clearBtn");

let conversation = [];


/* =========================
   SEND MESSAGE
========================= */

async function sendMessage(message) {

    if (!message.trim()) return;

    welcome.style.display = "none";

    addMessage("user", message);

    conversation.push({
        role: "user",
        content: message
    });

    messageInput.value = "";

    resizeTextarea();

    setLoading(true);

    const typingElement = showTyping();

    try {

        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message,
                history: conversation.slice(-12)
            })
        });


        const data = await response.json();

        typingElement.remove();


        if (!response.ok || !data.success) {

            throw new Error(
                data.error || "Something went wrong."
            );
        }


        addMessage("ai", data.reply);

        conversation.push({
            role: "assistant",
            content: data.reply
        });


    } catch (error) {

        console.error(error);

        addMessage(
            "ai",
            "Sorry, I couldn't connect to VEXORA-AI right now. Please make sure the backend server is running."
        );

    } finally {

        setLoading(false);

    }
}


/* =========================
   ADD MESSAGE
========================= */

function addMessage(role, text) {

    const message = document.createElement("div");

    message.className =
        `message ${role}-message`;


    const avatar = document.createElement("div");

    avatar.className =
        `avatar ${role === "ai" ? "ai-avatar" : "user-avatar"}`;

    avatar.textContent =
        role === "ai" ? "V" : "YOU";


    const content = document.createElement("div");

    content.className = "message-content";


    const name = document.createElement("div");

    name.className = "message-name";

    name.textContent =
        role === "ai"
            ? "VEXORA-AI"
            : "YOU";


    const textElement = document.createElement("div");

    textElement.className = "message-text";

    textElement.textContent = text;


    content.appendChild(name);
    content.appendChild(textElement);

    message.appendChild(avatar);
    message.appendChild(content);

    chatArea.appendChild(message);

    scrollToBottom();
}


/* =========================
   TYPING INDICATOR
========================= */

function showTyping() {

    const message = document.createElement("div");

    message.className = "message ai-message";


    const avatar = document.createElement("div");

    avatar.className = "avatar ai-avatar";

    avatar.textContent = "V";


    const content = document.createElement("div");

    content.className = "message-content";


    const name = document.createElement("div");

    name.className = "message-name";

    name.textContent = "VEXORA-AI";


    const typing = document.createElement("div");

    typing.className = "typing";

    typing.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;


    content.appendChild(name);
    content.appendChild(typing);

    message.appendChild(avatar);
    message.appendChild(content);

    chatArea.appendChild(message);

    scrollToBottom();

    return message;
}


/* =========================
   LOADING
========================= */

function setLoading(isLoading) {

    sendBtn.disabled = isLoading;

    messageInput.disabled = isLoading;

    if (!isLoading) {
        messageInput.focus();
    }
}


/* =========================
   SCROLL
========================= */

function scrollToBottom() {

    chatArea.scrollTo({
        top: chatArea.scrollHeight,
        behavior: "smooth"
    });
}


/* =========================
   TEXTAREA AUTO SIZE
========================= */

function resizeTextarea() {

    messageInput.style.height = "auto";

    messageInput.style.height =
        Math.min(messageInput.scrollHeight, 150) + "px";
}


messageInput.addEventListener(
    "input",
    resizeTextarea
);


/* =========================
   FORM SUBMIT
========================= */

chatForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        const message =
            messageInput.value.trim();

        if (!message) return;

        sendMessage(message);
    }
);


/* =========================
   ENTER TO SEND
========================= */

messageInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            chatForm.requestSubmit();
        }
    }
);


/* =========================
   SUGGESTIONS
========================= */

document
    .querySelectorAll(
        ".suggestion, .side-item"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const message =
                    button.dataset.message;

                if (message) {
                    sendMessage(message);
                }
            }
        );
    });


/* =========================
   CLEAR CHAT
========================= */

function clearChat() {

    conversation = [];

    chatArea.innerHTML = "";

    chatArea.appendChild(welcome);

    welcome.style.display = "block";

    messageInput.value = "";

    resizeTextarea();

    messageInput.focus();
}


clearBtn.addEventListener(
    "click",
    clearChat
);


newChatBtn.addEventListener(
    "click",
    clearChat
);

