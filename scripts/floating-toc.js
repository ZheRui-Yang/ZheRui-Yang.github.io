const body = document.getElementsByTagName("body")[0];
const sidetoc = document.getElementById("SideTOC");

body.onscroll = function() {
  const span = document.getElementById("change-point");
  const tocBtn = document.getElementById("toc-button");

  if (document.documentElement.scrollTop>=span.offsetTop) {
    tocBtn.style.display = "block";
  } else {
    
    if (sidetoc.style.display == "block") {
      toggleSideTOC();
    }

    tocBtn.style.display = "none";
  }

};

function toggleSideTOC() {
  if (sidetoc.style.display == "none") {
    sidetoc.style.display = "block";
    body.style.paddingLeft = "27%";
  } else {
    sidetoc.style.display = "none";
    body.style.paddingLeft = "50px";
  }
}
