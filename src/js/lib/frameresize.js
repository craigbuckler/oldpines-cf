// resize iframes to fit content when alerted of content change
const iframe = Array.from( document.querySelectorAll('iframe.resize') );

if (iframe.length) {

  window.addEventListener(
    'message',
    e => {
      if (e.data === 'update') {
        iframe.forEach(i => {
          const fHeight = i.contentWindow.document.body.scrollHeight;
          if (fHeight > 300) i.style.height = fHeight + 'px';
        });
      }
    },
    false
  );

}
