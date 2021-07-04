const body = document.getElementsByTagName("body")[0];
const span = document.getElementById("change-point");
const sidetoc = document.getElementById("SideTOC");

body.onscroll = function() {
  if (document.documentElement.scrollTop>=span.offsetTop) {
    body.style.paddingLeft = "27%";
    sidetoc.style.display = "block";
  } else {
    body.style.paddingLeft = "50px";
    sidetoc.style.display = "none";
  }

};
