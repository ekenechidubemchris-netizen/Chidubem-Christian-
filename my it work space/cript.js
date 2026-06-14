/* ================================================================
   CHI'S KITCHEN — script.js
   ================================================================
   HOW JAVASCRIPT WORKS:
   JavaScript is the "brain" of the website.
   HTML = the skeleton (structure)
   CSS  = the skin (appearance)
   JS   = the muscles (behaviour & interaction)

   This file is linked at the BOTTOM of index.html with:
       <script src="script.js"></script>
   (Placing it at the bottom means the whole page loads before
    this script runs — so all elements exist when we look for them.)
   ================================================================ */


/* ================================================================
   PART 1 — RUN WHEN PAGE IS FULLY LOADED
   document.addEventListener('DOMContentLoaded', ...) means:
   "Wait until the browser has read all the HTML, THEN run this."
   Everything inside the callback function {} runs at page load.
================================================================ */
document.addEventListener('DOMContentLoaded', function () {


  /* ── 1A. SMOOTH SCROLL FOR ALL NAV LINKS ──────────────────────
     When a link like <a href="#works"> is clicked, instead of
     jumping instantly we scroll smoothly to that section.

     querySelectorAll('a[href^="#"]') means:
     "Find every <a> tag whose href starts with #"
  ──────────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();                        // stop the instant jump
        target.scrollIntoView({
          behavior: 'smooth',  // animated scroll
          block: 'start'       // align to top of the section
        });

        /* If mobile menu is open, close it after clicking a link.
           Bootstrap's Collapse API closes the navbar */
        var navCollapse = document.getElementById('navbarMenu');
        if (navCollapse && navCollapse.classList.contains('show')) {
          /* Bootstrap's built-in Collapse: hide the navbar */
          var bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      }
    });
  });


  /* ── 1B. STICKY NAV SHADOW ON SCROLL ──────────────────────────
     When the user scrolls down, add a subtle shadow to the navbar
     so it visually lifts above the page content.

     window.addEventListener('scroll', ...) fires every time
     the user scrolls the page.
  ──────────────────────────────────────────────────────────────── */
  var navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 30) {
      /* scrollY is how many pixels the page has scrolled */
      navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });


  /* ── 1C. ACTIVE NAV LINK HIGHLIGHT ────────────────────────────
     As the user scrolls, highlight the nav link matching
     the section currently in view.

     IntersectionObserver watches elements and fires a callback
     whenever they enter or leave the visible screen area.
  ──────────────────────────────────────────────────────────────── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.navbar .nav-link');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        /* Remove 'active' class from all nav links */
        navLinks.forEach(function (link) {
          link.classList.remove('active-section');
        });
        /* Add 'active' class to the matching link */
        var id = entry.target.getAttribute('id');
        var matchingLink = document.querySelector('.navbar .nav-link[href="#' + id + '"]');
        if (matchingLink) matchingLink.classList.add('active-section');
      }
    });
  }, {
    threshold: 0.4  /* section must be 40% visible to trigger */
  });

  sections.forEach(function (section) { observer.observe(section); });

  /* Style the active nav link with gold colour */
  var style = document.createElement('style');
  style.textContent = '.active-section { color: var(--gold) !important; }';
  document.head.appendChild(style);


}); /* ── END DOMContentLoaded ── */


/* ================================================================
   PART 2 — ADD A COMMENT
   This function is called by onclick="addComment()" in index.html.
   It reads the form fields, validates them, builds a comment
   HTML block, and injects it into the page.
================================================================ */
function addComment() {

  /* ── Step 1: Read the typed values ─────────────────────────── */
  /* .value.trim() reads the input and removes leading/trailing spaces */
  var name = document.getElementById('commentName').value.trim();
  var text = document.getElementById('commentText').value.trim();

  /* ── Step 2: Validate — don't allow empty fields ────────────── */
  if (!name || !text) {
    /* Show Bootstrap's alert by making it visible */
    var alertBox = document.getElementById('commentAlert');
    alertBox.classList.remove('d-none'); /* Bootstrap class: d-none = display:none */
    setTimeout(function () {
      alertBox.classList.add('d-none'); /* hide again after 3 seconds */
    }, 3000);
    return; /* stop the function here — don't add the comment */
  }

  /* ── Step 3: Format today's date ────────────────────────────── */
  var now     = new Date();
  var options = { month: 'long', year: 'numeric' };
  var dateStr = now.toLocaleDateString('en-GB', options); /* e.g. "June 2025" */

  /* ── Step 4: Build the HTML for the new comment ─────────────── */
  /*
     Template literals use backticks ` ` instead of quotes.
     They let you write HTML across multiple lines and
     drop in variable values with ${variableName}.
  */
  var newComment = `
    <div class="comment-item">
      <span class="comment-author">${name}</span>
      <span class="comment-date">${dateStr}</span>
      <p class="comment-text">${text}</p>
    </div>
  `;

  /* ── Step 5: Insert the comment at the TOP of the list ──────── */
  /*
     getElementById finds the container <div id="commentsList">
     insertAdjacentHTML places new HTML at a position relative to it.
     'afterbegin' = just inside the opening tag = appears at the top.
  */
  document.getElementById('commentsList').insertAdjacentHTML('afterbegin', newComment);

  /* ── Step 6: Clear the form fields ──────────────────────────── */
  document.getElementById('commentName').value = '';
  document.getElementById('commentText').value = '';

  /* ── Step 7: Show a success message ─────────────────────────── */
  var successBox = document.getElementById('commentSuccess');
  successBox.classList.remove('d-none');
  setTimeout(function () {
    successBox.classList.add('d-none');
  }, 3000);
}


/* ================================================================
   PART 3 — SCROLL-REVEAL ANIMATION
   When sections scroll into view, fade them in from below.
   This makes the page feel alive without being distracting.
================================================================ */
(function () {
  /* IntersectionObserver: fires when elements enter the viewport */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target); /* stop watching after revealed */
      }
    });
  }, { threshold: 0.12 });

  /* Inject the CSS for the reveal animation */
  var revealStyle = document.createElement('style');
  revealStyle.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.55s ease, transform 0.55s ease;
    }
    .reveal.revealed {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(revealStyle);

  /* Watch all work cards and contact cards */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.work-card, .contact-card, .about-text').forEach(function (el) {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  });
})();
/* The () at the end immediately calls this function —
   it's called an "IIFE" (Immediately Invoked Function Expression).
   We wrap it so its variables don't collide with other code. */