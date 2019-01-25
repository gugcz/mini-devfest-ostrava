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
        const talkContainer = document.getElementById('talk-container');

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

        if (!speaker.talk.empty) {
            talkContainer.style.display = 'block';
            const talkTitle = document.getElementById('dialog-talk-title');
            const talkLevel = document.getElementById('dialog-talk-level');
            const talkIntro = document.getElementById('dialog-talk-intro');
            const topicsContainer = document.getElementById('dialog-talk-topics-container');
            topicsContainer.innerHTML = '';

            talkTitle.innerText = speaker.talk.title;
            
            if (speaker.talk.level) {
                talkLevel.style.display = 'block';
                talkLevel.innerText = speaker.talk.level;
            } else {
                talkLevel.style.display = 'none';
            }

            if (speaker.talk.intro) {
                talkIntro.style.display = 'block';
                talkIntro.innerHTML = speaker.talk.intro;
            } else {
                talkIntro.style.display = 'none';
            }

            if (speaker.talk.topics) {
                topicsContainer.style.display = 'flex';
                speaker.talk.topics
                    .map(topic =>
                        `<div class="topic">
                            <div class="topic-dot" style="background-color: ${topic.color}"></div>
                            <div class="topic-name">${topic.text}</div>
                        </div>`)
                    .forEach(topicHTML => topicsContainer.innerHTML +=topicHTML);
            } else {
                topicsContainer.style.display = 'none';
            }
        } else {
            talkContainer.style.display = 'none';
        }
    });

    dialog.listen('MDCDialog:closed', () => {
        const name = document.getElementById('dialog-speaker-name');
        const position = document.getElementById('dialog-speaker-position');
        const companyLogo = document.getElementById('dialog-speaker-company');
        const photo = document.getElementById('dialog-speaker-photo');
        const about = document.getElementById('dialog-speaker-text-about');
        const talkTitle = document.getElementById('dialog-talk-title');
        const talkLevel = document.getElementById('dialog-talk-level');
        const talkIntro = document.getElementById('dialog-talk-intro');

        name.innerText = '';
        position.innerText = '';
        photo.src = '';
        companyLogo.src = '';
        companyLogo.style.display = 'none';
        about.innerText = '';
        talkTitle.innerHTML = '';
        talkLevel.innerHTML = '';
        talkIntro.innerHTML = '';
    });
    dialog.open();
}

function toDiv(data, doc) {
    const div = document.createElement('div');
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
    return div;
}

function fetchSpeakers() {
    const speakersContainer = document.getElementById('speakers-container');
    db.collection('speakers').orderBy('order')
        .get()
        .then(querySnapshot => querySnapshot.forEach(doc => {
            const data = doc.data();
            data.talkRef.get().then(talk => {
                data.talk = talk.data();
                speakers[doc.id] = data;
                speakersContainer.appendChild(toDiv(data, doc));
            }).catch(error => console.log("Error getting documents: ", error));
        }))
        .catch(error => console.log("Error getting documents: ", error));
}