const body = document.getElementsByTagName("body")[0];
const sideTOC = document.getElementById("SideTOC");
const tocBtn = document.getElementById("toc-button");
const tocBackButton = document.getElementById("tocBackButton");
const tocBackRect = document.getElementById("rect99");
const span = document.getElementById("change-point");


sideTOC.style.display = "none";

body.onscroll = function() {
  if (document.documentElement.scrollTop > span.offsetTop) {
    if (sideTOC.style.display == "none") {
      tocBtn.style.display = "block";
    }
  } else {
    tocBtn.style.display = "none";
  }
};


function sideTOCOn() {
    sideTOC.style.display = "block";
    body.style.paddingLeft = "27%";
    tocBtn.style.display = "none";
    tocBackButton.style.display = "block";
}

function sideTOCOff() {
  sideTOC.style.display = "none";
  tocBackButton.style.display = "none";
  body.style.paddingLeft = "50px";
  if (document.documentElement.scrollTop > span.offsetTop) {
    tocBtn.style.display = "block";
  }
}

function tocBackColorOn() {
  tocBackRect.style.fill = "grey";
}

function tocBackColorOff() {
  tocBackRect.style.fill = "#fff6d5";
}
