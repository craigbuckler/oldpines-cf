/*
<slide-show> web component
*/

const config = {
  reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  minDelay: 5000,
  datasetActive: 'data-active',
  datasetPause: 'data-pause',
  intersectThreshold: 0.3,
  isSafari: (navigator?.vendor.toLowerCase() || '').includes('apple'),
};

class SlideShow extends HTMLElement {

  // initialise
  connectedCallback() {

    this.inView = true;
    this.last = +new Date() - config.minDelay * 2;

    // only one item or an iframe?
    if (this.children.length < 2 || this.querySelector('iframe')) return;

    // initialize
    Array.from( this.children ).forEach(i => {

      // pause all
      this.pause(i);

      // remove class
      i.dataset.class = i.className;
      i.className = '';

      // CSS animation
      i.addEventListener('animationend', e => {
        if (!this.#isVideo(e.target)) this.nextSlide();
      });

      if (this.#isVideo(i)) {

        // remove video looping
        i.loop = false;
        i.playbackRate = 0;

        if (!config.reduceMotion) {

          // speed
          i.playbackRate = parseFloat(i.dataset.rate || 1);

          // video playback ended event
          i.addEventListener('ended', () => this.nextSlide() );

        }

      }

    });

    // next slide fallback timer
    setInterval(() => this.nextSlide(), config.minDelay * 2);

    // window/tab active?
    document.addEventListener('visibilitychange',
      () => this.#eventVisibility(document.visibilityState !== 'hidden')
    );

    // component in view?
    const observer = new IntersectionObserver(entries => {
      this.#eventVisibility(entries[0].intersectionRatio >= config.intersectThreshold);
    }, {
      threshold: config.intersectThreshold
    });
    observer.observe(this);

    // activate first slide
    this.nextSlide();

  }


  // video and/or animation has ended
  nextSlide() {

    // ensure minimum delay
    const now = +new Date();
    if (!this.inView || now - this.last < config.minDelay) return;
    this.last = now;

    const
      currentActive = this.#getActive(),
      nextActive = currentActive?.nextElementSibling || this.firstElementChild;

    // activate
    if (currentActive) {
      currentActive.removeAttribute(config.datasetActive);
      currentActive.className = '';

      // rewind video
      if (this.#isVideo(currentActive)) currentActive.currentTime = 0;

    }
    nextActive.setAttribute(config.datasetActive, '');

    // reapply animated effect
    nextActive.className = nextActive.dataset.class;

    // Safari rewind video - must load() to reset WebM video
    if (config.isSafari && this.#isVideo(nextActive)) {
      nextActive.load();
      nextActive.playbackRate = parseFloat(nextActive.dataset.rate || 1);
    }

    this.play(nextActive);

    // preload next image
    const nextImg = nextActive.nextElementSibling;
    if (nextImg?.src && !nextImg.complete) {

      const img = new Image();
      img.src = nextImg.src;

    }

  }


  // tab/component visibility change
  #eventVisibility(visible) {
    this.inView = visible;
    if (this.inView) this.play();
    else this.pause();
  }


  // play video/animation
  play(e) {

    const active = e || this.#getActive();

    if (this.#isVideo(active)) active.play();
    active.removeAttribute(config.datasetPause);

  }


  // pause video/animation
  pause(e) {

    const active = e || this.#getActive();

    if (this.#isVideo(active)) active.pause();
    active.setAttribute(config.datasetPause, '');

  }


  // get active item
  #getActive() {
    return this.querySelector(`[${ config.datasetActive }]`);
  }


  // is node a <video> element?
  #isVideo(e) {
    return (e.nodeName.toUpperCase() === 'VIDEO');
  }

}

// register component
window.customElements.define('slide-show', SlideShow);
