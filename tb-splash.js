/* ============================================================
   TB Dev — <tb-splash>  (tb-splash.js)
   One tag, plays the logo sting once, then gets out of the way.
   Needs tokens.css + splash.css loaded on the page.

     <tb-splash></tb-splash>

   Attributes (all optional):
     tagline="games"     text under the rule; tagline="" hides it
     icon="/brand/assets/icon-512.png"
     hold="700"          ms to sit on the finished logo before finishing
     inline              render boxed in the page instead of full screen
     no-scanlines        drop the CRT texture
     dismiss             fade out and remove itself when done

   Fires "tb-splash-done" (bubbles) when the sting has finished.
     document.addEventListener('tb-splash-done', startGame);
   ============================================================ */

(function () {
  var here = (document.currentScript && document.currentScript.src) || '';
  var DEFAULT_ICON = here ? new URL('./assets/icon-512.png', here).href : 'assets/icon-512.png';
  var RUN = 1600; // animation length in ms, matches splash.css

  class TBSplash extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;

      var tagline = this.hasAttribute('tagline') ? this.getAttribute('tagline') : 'games';
      var icon = this.getAttribute('icon') || DEFAULT_ICON;
      var hold = parseInt(this.getAttribute('hold') || '700', 10);

      var root = document.createElement('div');
      root.className = 'tb-splash' + (this.hasAttribute('inline') ? ' tb-splash--inline' : '');
      root.setAttribute('role', 'img');
      root.setAttribute('aria-label', 'tb-dev' + (tagline ? ' ' + tagline : ''));

      var lockup = document.createElement('div');
      lockup.className = 'tb-splash__lockup';

      var tile = document.createElement('img');
      tile.className = 'tb-splash__tile';
      tile.src = icon;
      tile.alt = '';
      lockup.appendChild(tile);

      var type = document.createElement('div');
      type.className = 'tb-splash__type';

      var word = document.createElement('div');
      word.className = 'tb-splash__word';
      word.innerHTML = '<span><i class="t" style="font-style:normal">~/</i>tb<i class="d" style="font-style:normal">-dev</i></span>';
      var caret = document.createElement('div');
      caret.className = 'tb-splash__caret';
      word.appendChild(caret);
      type.appendChild(word);

      var rule = document.createElement('div');
      rule.className = 'tb-splash__rule';
      type.appendChild(rule);

      if (tagline) {
        var tag = document.createElement('div');
        tag.className = 'tb-splash__tag';
        tag.textContent = tagline;
        type.appendChild(tag);
      }

      lockup.appendChild(type);
      root.appendChild(lockup);

      if (!this.hasAttribute('no-scanlines')) {
        var scan = document.createElement('div');
        scan.className = 'tb-splash__scan';
        var sweep = document.createElement('div');
        sweep.className = 'tb-splash__sweep';
        root.appendChild(scan);
        root.appendChild(sweep);
      }

      var vig = document.createElement('div');
      vig.className = 'tb-splash__vignette';
      root.appendChild(vig);

      this.appendChild(root);
      this._root = root;

      var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var self = this;
      this._timer = setTimeout(function () { self.finish(); }, (reduced ? 0 : RUN) + hold);
    }

    /** Restart the sting from the top. */
    replay() {
      if (!this._root || !this._root.getAnimations) return;
      this._root.classList.remove('is-out');
      this._root.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); a.play(); });
    }

    /** End it now (skip on tap, or when your assets finish loading). */
    finish() {
      clearTimeout(this._timer);
      this.dispatchEvent(new CustomEvent('tb-splash-done', { bubbles: true }));
      if (!this.hasAttribute('dismiss')) return;
      var self = this;
      this._root.classList.add('is-out');
      setTimeout(function () { self.remove(); }, 340);
    }

    disconnectedCallback() { clearTimeout(this._timer); }
  }

  if (!customElements.get('tb-splash')) customElements.define('tb-splash', TBSplash);
})();
