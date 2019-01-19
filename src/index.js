import './styles/styles.scss';
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

fetchSpeakers();

function fetchSpeakers() {
    const speakersContainer = document.getElementById('speakers-container');

    db.collection('speakers').orderBy('order')
        .get()
        .then(querySnapshot =>
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const div = document.createElement('div');
                div.className = 'mdc-card mdc-card--outlined speaker mdc-card__primary-action mdc-ripple-upgraded speaker-' + data.order;
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