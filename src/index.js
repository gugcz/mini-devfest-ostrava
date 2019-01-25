import './styles/styles.scss';
import { MDCDialog } from '@material/dialog';
import { MDCRipple } from '@material/ripple';

const config = {
    apiKey: "AIzaSyAyXg9T4mK_Y6IjQKFU0l9gupIvrpJDq5M",
    authDomain: "mini-devfest-ostrava.firebaseapp.com",
    databaseURL: "https://mini-devfest-ostrava.firebaseio.com",
    projectId: "mini-devfest-ostrava",
    storageBucket: "mini-devfest-ostrava.appspot.com",
    messagingSenderId: "484092751852"
};

firebase.initializeApp(config);

const db = firebase.firestore();

const selector = '.mdc-card__primary-action, .button, .mdc-card__primary-action';
const ripples = [].map.call(document.querySelectorAll(selector), el => new MDCRipple(el));
const speakers = {};

const iconButtonRipple = new MDCRipple(document.querySelector('.mdc-icon-button'));
iconButtonRipple.unbounded = true;

fetchSpeakers();

function openDialog(id) {
    const dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
    dialog.listen('MDCDialog:opened', () => {
        const speaker = speakers[id];
        const name = document.getElementById('dialog-speaker-name');
        const position = document.getElementById('dialog-speaker-position');
        const companyLogo = document.getElementById('dialog-speaker-company');
        const photo = document.getElementById('dialog-speaker-photo');
        const about = document.getElementById('dialog-speaker-text-about');

        name.innerText = speaker.name;
        position.innerHTML = speaker.position + (speaker.company ? ', ' + speaker.company : '');
        photo.src = speaker.photoUrl;
        if (speaker.companyLogo) {
            companyLogo.style.display = 'block';
            companyLogo.src = speaker.companyLogo;
        } else {
            companyLogo.style.display = 'none';
        }
        about.innerText = speaker.about;
    });

    dialog.listen('MDCDialog:closed', () => {
        const name = document.getElementById('dialog-speaker-name');
        const position = document.getElementById('dialog-speaker-position');
        const companyLogo = document.getElementById('dialog-speaker-company');
        const photo = document.getElementById('dialog-speaker-photo');
        const about = document.getElementById('dialog-speaker-text-about');

        name.innerText = '';
        position.innerText = '';
        photo.src = '';
        companyLogo.src = '';
        companyLogo.style.display = 'none';
        about.innerText = '';
    });
    dialog.open();
}

function fetchSpeakers() {
    const speakersContainer = document.getElementById('speakers-container');

    db.collection('speakers').orderBy('order')
        .get()
        .then(querySnapshot =>
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const div = document.createElement('div');
                speakers[doc.id] = data;
                div.className = 'mdc-card mdc-card--outlined speaker mdc-card__primary-action mdc-ripple-upgraded speaker-' + data.order;
                div.onclick = () => openDialog(doc.id);
                div.innerHTML = `
                    <img class="speaker-photo" src="${data.photoUrl}" alt="${data.name}">
                    <h5 class="speaker-name">${data.name}</h5>
                    ${data.position && !data.company && `<h6 class="speaker-position">${data.position}</h6>` || ''}
                    ${data.position && data.company && `<h6 class="speaker-position">${data.position}, ${data.company}</h6>` || ''}
                    ${data.companyLogo && data.company && `<img class="speaker-company" src="${data.companyLogo}" alt="${data.company}">` || ''}
                    ${!data.companyLogo && `<div class="speaker-company"></div>` || ''}
                `;
                speakersContainer.appendChild(div);
            })
        )
        .catch(error => console.log("Error getting documents: ", error));
}