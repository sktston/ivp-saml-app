function init() {
  const backendUrl = window.location.protocol + "//" + window.location.host;
  console.log("backendUrl=", backendUrl);

  document.getElementById("btnMeta").onclick = function() {
    console.log("btnMeta clicked.");
    setMessage("btnMeta clicked.");
    let req = new XMLHttpRequest();
    req.open("GET", backendUrl + "/metadata.xml", true);
    req.onreadystatechange = function() {
      if (req.readyState === XMLHttpRequest.DONE) {
        setMessage(req.response);
      }
    }
    req.send();
  }

  /*
  document.getElementById("btnLogin").onclick = function() {
    console.log("btnLogin clicked.");
    setMessage("btnLogin clicked.");
    let req = new XMLHttpRequest();
    req.open("GET", backendUrl + "/login", true);
    req.onreadystatechange = function() {
      console.log("req.readyState=", req.readyState);
      console.log("req.response=", req.response);
      if (req.readyState === XMLHttpRequest.DONE) {
        setMessage(req.response);
      }
    }
    req.send();
  }
  */

  document.getElementById("btnAssert").onclick = function() {
    console.log("btnAssert clicked.");
  }

  document.getElementById("btnLogout").onclick = function() {
    console.log("btnLogout clicked.");
  }

  console.log("saml-app ready.");
}

function setMessage(s) {
  document.getElementById("msg").textContent = s;
}
