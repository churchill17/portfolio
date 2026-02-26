(function () {
  // grab elements safely
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("mobileNav");
  const yearEl = document.getElementById("year");
  const icon = hamburger ? hamburger.querySelector("i") : null;
  const sr = hamburger ? hamburger.querySelector(".sr-only") : null;

  function setExpanded(val) {
    if (hamburger)
      hamburger.setAttribute("aria-expanded", val ? "true" : "false");
  }

  function toggleIcon(open) {
    if (!icon) return;
    icon.classList.toggle("fa-bars", !open);
    icon.classList.toggle("fa-xmark", open);
    icon.setAttribute("aria-hidden", "true");
    if (sr) sr.textContent = open ? "Close menu" : "Open menu";
  }

  function openNav() {
    if (nav) {
      nav.classList.add("open");
      document.body.style.overflow = "hidden"; // prevent body scroll when overlay open
    }
    if (hamburger) hamburger.classList.add("open");
    setExpanded(true);
    toggleIcon(true);
  }

  function closeNav() {
    if (nav) {
      nav.classList.remove("open");
      document.body.style.overflow = "";
    }
    if (hamburger) hamburger.classList.remove("open");
    setExpanded(false);
    toggleIcon(false);
  }

  // update year if present
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // toggle via hamburger
  if (hamburger) {
    hamburger.addEventListener("click", function () {
      const expanded = hamburger.getAttribute("aria-expanded") === "true";
      if (nav) {
        if (expanded) closeNav();
        else openNav();
      } else {
        // if nav is missing, just toggle icon/aria
        if (expanded) {
          setExpanded(false);
          toggleIcon(false);
        } else {
          setExpanded(true);
          toggleIcon(true);
        }
      }
    });
  }

  // close when clicking a link (only when nav is overlay / fixed)
  if (nav) {
    const links = Array.from(nav.querySelectorAll("a"));
    links.forEach((link) =>
      link.addEventListener("click", function () {
        // mark the clicked link as active (remove from others)
        links.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");

        const style = window.getComputedStyle(nav);
        if (style.position === "fixed") closeNav();
      }),
    );
  }

  // close on escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
      const isOpen =
        (nav && nav.classList.contains("open")) ||
        (hamburger && hamburger.getAttribute("aria-expanded") === "true");
      if (isOpen) closeNav();
    }
  });

  // click outside to close when overlay open
  document.addEventListener("click", function (e) {
    if (!nav || !nav.classList.contains("open")) return;
    const target = e.target;
    const clickedInsideNav = nav.contains(target);
    const clickedHamburger = hamburger && hamburger.contains(target);
    if (!clickedInsideNav && !clickedHamburger) {
      closeNav();
    }
  });

  // sync state when viewport crosses desktop breakpoint
  const mq = window.matchMedia("(min-width: 1024px)");
  function handleMqChange(e) {
    if (e.matches) {
      closeNav();
    }
  }

  if (mq.addEventListener) mq.addEventListener("change", handleMqChange);
  else if (mq.addListener) mq.addListener(handleMqChange);

  // initialize icon state from aria
  if (hamburger) {
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    toggleIcon(expanded);
  }
})();
