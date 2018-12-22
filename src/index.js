import './styles/styles.scss';
import {MDCRipple} from '@material/ripple';

const selectors = ['.mdc-card__primary-action', '.button', '.mdc-card__primary-action'];

selectors.forEach(it => new MDCRipple(document.querySelector(it)));