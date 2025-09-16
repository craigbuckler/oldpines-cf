// email obsfucation
Array.from( document.getElementsByClassName('email') ).forEach(e => {

  const
    ds = e.dataset.email,
    em = (ds || e.textContent),
    es = em.replace(/\sdot\s/ig, '.').replace(/\{at\}/ig,'@').replace(/\s/g,'');

  if (em !== es) {
    const link = e.closest('a');
    link.href = 'ma'+'ilt'+'o:'+es;
    if (!ds) e.textContent = es;

    link.addEventListener('click', ev => {
      alert('Sorry - our email is temporarily unavailable.\nPlease call us on +44 (0)1397 712 324.');
      ev.preventDefault();
    });
  }

});
