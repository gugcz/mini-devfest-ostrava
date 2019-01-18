import './styles/styles.scss';
import {MDCRipple} from '@material/ripple';

const selector = '.mdc-card__primary-action, .button, .mdc-card__primary-action';
const ripples = [].map.call(document.querySelectorAll(selector), el => new MDCRipple(el));