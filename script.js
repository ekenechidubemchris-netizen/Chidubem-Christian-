
/*================================================================ */
document.addEventListener('DOMContentLoaded', function () {


  /*──────────────────────────────────────────────────────────────── */
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


  /* 
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


  /* 
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


  /*
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
 
================================================================ */
function escapeHTML(str) {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}
