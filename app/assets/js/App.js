import '../styles/styles.css';
import MobileMenu from '../js/modules/MobileMenu.js';
import RevealOnScroll from '../js/modules/RevealOnScroll';
import StickyHeader from '../js/modules/StickyHeader';

new RevealOnScroll(document.querySelectorAll('.feature-item'), 75);
new RevealOnScroll(document.querySelectorAll('.testimonial'), 60);
new StickyHeader();
new MobileMenu();
