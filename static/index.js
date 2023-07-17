const UrlInput = document.getElementById("url");
const MainFrame = document.getElementById("main-frame");
const GoButton = document.getElementById("go-button");
const SiteTitle = document.getElementById("site-title");

const KAISocket = new WebSocket("ws://localhost:4999");

const instruction = "Output.";

let textBuffer = "";

// Connection opened
// socket.addEventListener("open", (event) => {
//   socket.send("Hello Server!");
// });

// Listen for messages

// UI
GoButton.addEventListener("click", function () {
    renderFrame(UrlInput.value);
});

UrlInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        GoButton.click();
        UrlInput.blur();
    }
});

async function waitForFrameLoad(btn) {
    return new Promise(resolve => MainFrame.onload = () => resolve());
}

async function renderFrame(path) {
    textBuffer = "";
    UrlInput.value = path;
    GoButton.innerText = "Loading...";
    GoButton.classList.add("loading");
    MainFrame.src = "javascript:void(0);";

    const command = {
        cmd: "raw_generate", params: {
            prompt: `Instruction: ${instruction}
### Input: ${path}
### Response: `}
    };

    KAISocket.send(JSON.stringify(command));
}

KAISocket.addEventListener("message", (event) => {
    console.log("Message from server ", event.data);
    const result = JSON.parse(event.data).result;

    if (result === true) {
        // Done here
        textBuffer = "";
        GoButton.innerText = "Go";
        GoButton.classList.remove("loading");
        MainFrame.contentDocument.close();
        return;
    }

    // Render text chunk
    const textChunk = result[0];
    textBuffer += textChunk;

    // HACK: We need real security ASAP while also allowing fun little
    // scripts. Most things should be allowed as long as they don't attempt
    // to access outside resources.
    textBuffer = textBuffer.replaceAll("http", "zzzz");
    textBuffer = textBuffer.replaceAll(".com", "DOTzzz");

    console.log(textBuffer);
    // MainFrame.srcdoc = textBuffer;
    MainFrame.contentDocument.write(textBuffer);

    SiteTitle.innerText = MainFrame.contentDocument.title || "Untitled";

    // Hook into stuff
    for (const anchor of MainFrame.contentDocument.querySelectorAll("a")) {
        anchor.addEventListener("click", function (event) {
            event.preventDefault();
            renderFrame(anchor.href);
        });
    }
});