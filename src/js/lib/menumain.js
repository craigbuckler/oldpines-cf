// main menu dialog
const
  menuOpen = document.querySelectorAll('.menumain-open'),
  menuMain = document.querySelector('#menumain');

if (menuOpen.length && menuMain) {

  // open dialog
  Array.from(menuOpen).forEach(e => e.addEventListener('click', () => {
    menuMain.showModal();
  }));

  // close dialog
  menuMain.addEventListener('click', e => {
    if (e.target === menuMain) menuMain.close();
  });

}
