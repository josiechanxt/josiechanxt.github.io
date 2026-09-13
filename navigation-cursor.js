/* Adds a project-coloured ring around the standard pointer over interactive UI. */
document.addEventListener("DOMContentLoaded", function () {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return;
  }

  var interactiveSelector = [
    ".navbar-brand", "a[href]", "button", "[role='button']",
    "input[type='button']", "input[type='submit']", "input[type='reset']",
    "input[type='checkbox']", "input[type='radio']", "select", "summary",
    ".slider-arrow", ".dot", ".fab", ".accordion-header",
    "[data-custom-circle-cursor]"
  ].join(",");
  var navbarSelector = ".navbar .navbar-brand, .navbar .nav-link, .navbar .navbar-toggler";
  var footerSelector = ".footer-dark a[href], .footer-dark button, .footer-dark [role='button']";
  var projectCursorColors = {
    "MandaiX.html": "#07846b",
    "GovTech.html": "#715ad8",
    "Enhancing Fei Yang Band.html": "#d63d3f",
    "TheBeeCrisis.html": "#dd8203"
  };

  var cursor = document.createElement("div");
  cursor.className = "project-circle-cursor";
  cursor.setAttribute("aria-hidden", "true");
  document.body.appendChild(cursor);

  var style = document.createElement("style");
  style.textContent =
    ".project-circle-cursor{position:fixed;top:0;left:0;width:32px;height:32px;box-sizing:border-box;border:2px solid currentColor;border-radius:50%;color:var(--project-cursor-color,#007bff);pointer-events:none;z-index:9999999;transform:translate(-50%,-50%) scale(0);transition:transform .2s cubic-bezier(.25,1,.5,1)}.project-circle-cursor::before{content:'';position:absolute;inset:0;border-radius:inherit;background:currentColor;opacity:.15}.project-circle-cursor.active{transform:translate(-50%,-50%) scale(1)}.project-circle-cursor.active.pressed{transform:translate(-50%,-50%) scale(1.2)}" +
    interactiveSelector + "{cursor:pointer!important}";
  document.head.appendChild(style);

  function targetFor(element) {
    if (element && element.closest("[data-custom-circle-cursor]")) {
      return null;
    }
    return element && element.closest(interactiveSelector);
  }

  document.addEventListener("mousemove", function (event) {
    cursor.style.left = event.clientX + "px";
    cursor.style.top = event.clientY + "px";
  });

  document.addEventListener("mousedown", function () {
    if (cursor.classList.contains("active")) {
      cursor.classList.add("pressed");
    }
  });

  document.addEventListener("mouseup", function () {
    cursor.classList.remove("pressed");
  });

  document.addEventListener("pointerover", function (event) {
    var target = targetFor(event.target);
    if (target) {
      var projectLink = target.classList.contains("btn-outline-work") && target.getAttribute("href");
      var projectFile = projectLink && decodeURIComponent(projectLink.split("/").pop().split("#")[0]);
      var cursorColor = target.closest(footerSelector) ? "#007bff" :
        target.closest(navbarSelector) ? "#007bff" :
        target.dataset.cursorColor ||
        projectCursorColors[projectFile] ||
        window.getComputedStyle(target).getPropertyValue("--project-cursor-color").trim() ||
        "";
      if (cursorColor) {
        cursor.style.color = cursorColor;
      } else {
        cursor.style.removeProperty("color");
      }
      cursor.classList.add("active");
    }
  });

  document.addEventListener("pointerout", function (event) {
    var target = targetFor(event.target);
    if (target && !target.contains(event.relatedTarget)) {
      cursor.classList.remove("active", "pressed");
    }
  });
});
