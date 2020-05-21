import '../styles/styles.css';
import MobileMenu from '../js/modules/MobileMenu.js';
import RevealOnScroll from '../js/modules/RevealOnScroll';
import StickyHeader from '../js/modules/StickyHeader';

new StickyHeader();
new RevealOnScroll(document.querySelectorAll('.feature-item'), 75);
new RevealOnScroll(document.querySelectorAll('.testimonial'), 60);
new MobileMenu();
// Code Splitting
let modal;
document.querySelectorAll('.open-modal').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    console.log(modal);
    if (typeof modal === 'undefined') {
      // Add prefix name - modal
      import(/* webpackChunkName: "modal" */ './modules/Modal.js')
        .then((x) => {
          modal = new x.default();
          setTimeout(() => modal.openTheModal(), 20);
        })
        .catch(() => console.log('There was a problem.'));
    } else {
      modal.openTheModal();
    }
  });
});
