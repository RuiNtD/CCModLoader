$ = document.querySelector;

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
  e.source.postMessage("Message received", e.origin);
}

function handleLoad(data) {
  let rawoptions = $("#rawoptions");
  rawoptions.value = JSON.stringify(data, null, 2);
}

function sendMessage(type, data) {
  parent.postMessage({ type: type, data: data }, "*");
}

$("#save").onClick = function () {
  let rawoptions = $("#rawoptions");
  let data = JSON.parse(rawoptions.value);
  sendMessage("save", data);
  handleLoad(data);
};

$("#forcesave").onClick = function () {
  $("#save").onClick();
  sendMessage("forceSave");
};

$("#load").onClick = function () {
  sendMessage("load");
};

$("#default").onClick = function () {
  sendMessage("default");
};
