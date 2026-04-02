(function () {
  // Set this to your Cloudflare Worker URL after deploying
  var WORKER_URL = 'https://expressions-comments.YOUR_SUBDOMAIN.workers.dev';

  var form = document.getElementById('comment-form');
  var list = document.getElementById('comment-list');
  var emptyNote = document.getElementById('comments-empty');
  if (!form) return;

  var slug = form.dataset.slug;

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
    });
  }

  function buildCommentEl(name, text, date) {
    var item = document.createElement('li');
    item.className = 'comment-item';
    item.innerHTML =
      '<blockquote class="comment-text">' + escapeHtml(text) + '</blockquote>' +
      '<footer class="comment-meta">' +
        '<span class="comment-name">\u2014 ' + escapeHtml(name) + '</span>' +
        '<time class="comment-date">' + formatDate(date) + '</time>' +
      '</footer>';
    return item;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nameInput = form.querySelector('[name="comment-name"]');
    var textInput = form.querySelector('[name="comment-text"]');
    var submitBtn = form.querySelector('[type="submit"]');

    var name = nameInput.value.trim();
    var text = textInput.value.trim();
    if (!name || !text) return;

    var date = new Date().toISOString();

    // Show immediately in DOM
    if (emptyNote) { emptyNote.style.display = 'none'; }
    list.appendChild(buildCommentEl(name, text, date));

    // Reset form
    nameInput.value = '';
    textInput.value = '';
    submitBtn.textContent = 'posted';
    submitBtn.disabled = true;
    setTimeout(function () {
      submitBtn.textContent = 'post';
      submitBtn.disabled = false;
    }, 3000);

    // Persist via Cloudflare Worker
    fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: slug, name: name, text: text, date: date })
    }).catch(function () {});
  });
})();
