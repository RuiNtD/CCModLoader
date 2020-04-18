function l(what) {
  return document.getElementById(what);
}

if (window.addEventListener)
  window.addEventListener("message", handleMessage, false);
else if (window.attachEvent)
  // ie8
  window.attachEvent("onmessage", handleMessage);

// iframe.contentWindow.postMessage({}, '*');
// parent.postMessage({}, '*');

function handleMessage(e) {
  if (!(e.data && typeof e.data == "object" && e.data.type)) return;
  switch (e.data.type) {
    case "load":
      handleLoad(e.data.data);
      break;
  }
}

function handleLoad(data) {
  console.log("handleLoad", data);
  if (!data) return;
  l("rawoptions").value = JSON.stringify(data, null, 2);
}

function sendMessage(type, data) {
  console.log("sendMessage", type, data);
  parent.postMessage({ type: type, data: data }, "*");
}

l("save").onclick = function () {
  let data = JSON.parse(l("rawoptions").value);
  sendMessage("save", data);
  handleLoad(data);
};

l("forcesave").onclick = function () {
  l("save").onclick();
  sendMessage("forceSave");
};

l("load").onclick = function () {
  sendMessage("load");
};

l("default").onclick = function () {
  sendMessage("default");
};

sendMessage("load");
