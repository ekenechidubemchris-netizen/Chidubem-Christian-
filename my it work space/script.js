/* ================================================================
   CHI'S KITCHEN — script.js
   ================================================================
   WHAT WAS WRONG (fixes marked ✅):
   ✅ FIX 1: Script was cut off — DOMContentLoaded block was incomplete
   ✅ FIX 2: addComment() was never fully defined — button did nothing
   ✅ FIX 3: Scroll shadow on navbar was missing its handler
   ✅ FIX 4: No scroll-reveal animation for cards
   ================================================================

   HOW THIS CONNECTS TO THE OTHER FILES:
   • index.html loads this file with: <script src="script.js"></script>
   • It uses id="commentName", id="commentText", id="commentsList"
     id="commentAlert", id="commentSuccess" — all defined in index.html
   • It adds/removes CSS classes defined in style.css
     (.scrolled on .navbar, fade-in on .work-card and .contact-card)
================================================================ */


/* ================================================================
   PART 1 — RUN WHEN PAGE IS FULLY LOADED
   Waits for HTML to be ready, then sets up all event listeners.
================================================================ */
document.addEventListener('DOMContentLoaded', function () {


  /* ── 1A. SMOOTH SCROLL FOR ALL ANCHOR LINKS ──────────────────
     Finds every <a href="#..."> in index.html and makes it scroll
     smoothly instead of jumping.
  ──────────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      var target = document.querySelector(targetId);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        /* Close mobile hamburger menu if it's open */
        var navCollapse = document.getElementById('navbarMenu');
        if (navCollapse && navCollapse.classList.contains('show')) {
          var bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      }
    });
  });


  /* ── 1B. NAVBAR SHADOW ON SCROLL ────────────────────────────
     ✅ FIX: This block was cut off in the original file.
     Adds 'scrolled' class to <nav id="mainNav"> when user scrolls.
     The .scrolled style in style.css adds a stronger box-shadow.
  ──────────────────────────────────────────────────────────────── */
  var mainNav = document.getElementById('mainNav');

  window.addEventListener('scroll', function () {
    if (mainNav) {
      if (window.scrollY > 40) {
        mainNav.classList.add('scrolled');
      } else {
        mainNav.classList.remove('scrolled');
      }
    }
  });


  /* ── 1C. SCROLL-REVEAL ANIMATION FOR CARDS ──────────────────
     ✅ FIX: Added this so work-cards and contact-cards fade in
     as the user scrolls down to them, instead of appearing flat.

     IntersectionObserver watches elements and fires when they
     enter the viewport (the visible part of the screen).
  ──────────────────────────────────────────────────────────────── */

  /* First, add the starting (hidden) state to cards */
  var revealTargets = document.querySelectorAll('.work-card, .contact-card, .comment-item');

  revealTargets.forEach(function (el) {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  /* Observer: when a card enters view, animate it in */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target); /* animate once, not repeatedly */
      }
    });
  }, {
    threshold: 0.15  /* trigger when 15% of the card is visible */
  });

  revealTargets.forEach(function (el) {
    observer.observe(el);
  });


  /* ── 1D. ACTIVE NAV LINK HIGHLIGHT ON SCROLL ────────────────
     As the user scrolls past each section, the matching nav
     link gets an 'active' class so it lights up in gold.
  ──────────────────────────────────────────────────────────────── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.navbar .nav-link');

  window.addEventListener('scroll', function () {
    var scrollPos = window.scrollY + 120; /* offset for sticky navbar height */

    sections.forEach(function (section) {
      var top    = section.offsetTop;
      var bottom = top + section.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
        });

        /* Find the link that points to this section */
        var matchingLink = document.querySelector('.navbar .nav-link[href="#' + section.id + '"]');
        if (matchingLink) {
          matchingLink.classList.add('active');
        }
      }
    });
  });


}); /* END DOMContentLoaded */


/* ================================================================
   PART 2 — addComment()
   ✅ FIX: This function was never completed in the original file.

   Called by onclick="addComment()" on the Post Comment button
   in index.html.

   It reads from:
     #commentName  — the name input field
     #commentText  — the textarea
   It writes to:
     #commentsList — the list of comments on the right
   It shows/hides:
     #commentAlert   — red error box (if fields empty)
     #commentSuccess — green success box
================================================================ */
function addComment() {

  /* Get the input elements from index.html */
  var nameInput = document.getElementById('commentName');
  var textInput = document.getElementById('commentText');
  var alertBox  = document.getElementById('commentAlert');
  var successBox= document.getElementById('commentSuccess');
  var list      = document.getElementById('commentsList');

  /* Read and trim the values */
  var name    = nameInput.value.trim();
  var comment = textInput.value.trim();

  /* Hide any previous messages */
  alertBox.classList.add('d-none');
  successBox.classList.add('d-none');

  /* ── VALIDATE: both fields must have content ── */
  if (!name || !comment) {
    alertBox.classList.remove('d-none');
    return; /* stop here — don't add empty comment */
  }

  /* ── BUILD the new comment HTML ── */
  /* Get a friendly date string like "June 2026" */
  var now       = new Date();
  var monthName = now.toLocaleString('default', { month: 'long' });
  var year      = now.getFullYear();
  var dateStr   = monthName + ' ' + year;

  /* Create the HTML element */
  var newComment = document.createElement('div');
  newComment.className = 'comment-item';

  /* ✅ Uses the same HTML structure as the starter comments in index.html */
  newComment.innerHTML =
    '<div class="comment-meta">' +
      '<span class="comment-author">' + escapeHTML(name) + '</span>' +
      '<span class="comment-date">' + dateStr + '</span>' +
    '</div>' +
    '<p class="comment-text">' + escapeHTML(comment) + '</p>';

  /* Start hidden, then animate in (same as the scroll-reveal above) */
  newComment.style.opacity   = '0';
  newComment.style.transform = 'translateY(16px)';
  newComment.style.transition= 'opacity 0.4s ease, transform 0.4s ease';

  /* Add at the TOP of the comments list so newest shows first */
  list.insertBefore(newComment, list.firstChild);

  /* Trigger the animation on the next frame */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      newComment.style.opacity   = '1';
      newComment.style.transform = 'translateY(0)';
    });
  });

  /* ── CLEAR the form fields ── */
  nameInput.value = '';
  textInput.value = '';

  /* ── SHOW success message, then hide it after 3 seconds ── */
  successBox.classList.remove('d-none');
  setTimeout(function () {
    successBox.classList.add('d-none');
  }, 3000);

  /* Scroll the new comment into view */
  newComment.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}


/* ================================================================
   HELPER: escapeHTML
   Converts special characters so user input can't inject HTML.
   e.g.  <script>  becomes  &lt;script&gt;
   This is a basic security practice called "output encoding".
================================================================ */
function escapeHTML(str) {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}
