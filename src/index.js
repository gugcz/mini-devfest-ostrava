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

fetchSpeakersAndTalks();
fetchTimes();
fetchSchedule();
fetchPartners();

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
                talkLevel.innerText = speaker.talk.level + " / " + speaker.talk.language;
            } else if (speaker.talk.language) {
                talkLevel.style.display = 'block';
                talkLevel.innerText = speaker.talk.language;
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
                            <div class="topic-name mdc-typography--body1">${topic.text}</div>
                        </div>`)
                    .forEach(topicHTML => topicsContainer.innerHTML += topicHTML);
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

function speakerToDiv(data, doc) {
    const div = document.createElement('div');
    div.className = 'mdc-card mdc-card--outlined speaker mdc-card__primary-action mdc-ripple-upgraded speaker-' + data.order;
    div.onclick = () => openDialog(doc.id);
    div.innerHTML = `
            <img class="speaker-photo" src="${data.photoUrl}" alt="${data.name}">
            <h2 class="speaker-name mdc-typography--headline2">${data.name}</h2>
            ${data.position && !data.company && `<h3 class="speaker-position mdc-typography--headline3">${data.position}</h3>` || ''}
            ${data.position && data.company && `<h3 class="speaker-position mdc-typography--headline3">${data.position}, ${data.company}</h3>` || ''}
            ${data.companyLogo && data.company && `<img class="speaker-company" src="${data.companyLogo}" alt="${data.company}">` || ''}
            ${!data.companyLogo && `<div class="speaker-company"></div>` || ''}
        `;
    return div;
}

function talkToDiv(data, doc) {
    const { talk } = data;
    const div = document.createElement('div');
    div.className = 'mdc-card mdc-card--outlined mdc-card__primary-action mdc-ripple-upgraded talk ' + (talk.full ? 'full ' : ('column-' + talk.column + ' ')) + 'row-' + talk.row + ' mobile-row-' + talk.mobileRow;
    div.onclick = () => openDialog(doc.id);
    div.innerHTML = `
            <h2 class="talk-name mdc-typography--headline2">${talk.title}</h2>
            <div class="topics-container">
            ${talk.topics.map(topic =>
                `<div class="topic">
                        <div class="topic-dot" style="background-color: ${topic.color}"></div>
                        <p class="topic-name mdc-typography--body1">${topic.text}</p>
                    </div>`
            ).join('')}
            </div>
            <div class="mobile-description">
            <p class="mobile-description-text mdc-typography--body1">${talk.time} / ${talk.room}</p>
            </div>
            <div class="description">
            <p class="description-text mdc-typography--body1">${talk.level} / ${talk.language} / ${talk.length}</p>
            </div>
            <div class="speaker-container">
            <img class="speaker-photo" src="${data.photoUrl}" alt="${data.name}">
            <div class="speaker-text">
                <h3 class="name mdc-typography--headline3">${data.name}</h3>
                ${data.position && !data.company && `<h4 class="position mdc-typography--headline4">${data.position}</h4>` || ''}
                ${data.position && data.company && `<h4 class="position mdc-typography--headline4">${data.position}, ${data.company}</h4>` || ''}
            </div>
            </div>
        `;
    return div;
}

function fetchSpeakersAndTalks() {
    const speakersContainer = document.getElementById('speakers-container');
    const talksContainer = document.getElementById('talks-container');
    db.collection('speakers').orderBy('order')
        .get()
        .then(querySnapshot => querySnapshot.forEach(doc => {
            const data = doc.data();
            data.talkRef.get().then(talk => {
                data.talk = talk.data();
                speakers[doc.id] = data;
                data.talk.mobileRow = (data.talk.row - 2) * 2 + data.talk.column + 1;
                speakersContainer.appendChild(speakerToDiv(data, doc));
                if (!talk.empty) {
                    talksContainer.appendChild(talkToDiv(data, doc));
                }
            }).catch(error => console.log("Error getting documents: ", error));
        }))
        .catch(error => console.log("Error getting documents: ", error));
}

function fetchTimes() {
    const timesContainer = document.getElementById('times-container');
    const talksContainer = document.getElementById('talks-container');
    db.collection('times').orderBy('order')
        .get()
        .then(querySnapshot => querySnapshot.forEach(doc => {
            const data = doc.data();
            timesContainer.innerHTML += `<p class="time mdc-typography--headline4">${data.time}</p>`;
        }))
        .then(() => {
            timesContainer.style.gridTemplateRows = gridTemplateRows;
            talksContainer.style.gridTemplateRows = gridTemplateRows;
        })
        .catch(error => console.log("Error getting documents: ", error));
}

function fetchSchedule() {
    const talksContainer = document.getElementById('talks-container');
    db.collection('schedule')
        .get()
        .then(querySnapshot => querySnapshot.forEach(doc => {
            const item = doc.data();
            if (item.fullColumn) {
                talksContainer.innerHTML +=
                    `<div class="mdc-card mdc-card--outlined mdc-card__primary-action mdc-ripple-upgraded schedule-item row-${item.row} ${item.hideOnMobile && ' no-mobile ' || ''} ${'mobile-row-' + (item.row * 2 - 2)} full-column">
                        <h2 class="item-name mdc-typography--headline2">${item.name}</h2>
                    </div>`;
            } else {
                talksContainer.innerHTML +=
                    `<div class="mdc-card mdc-card--outlined mdc-card__primary-action mdc-ripple-upgraded schedule-item row-${item.row} ${'column-' + item.column} ${item.hideOnMobile && ' no-mobile' || ''} ${'mobile-row-' + (item.row * 2 - 3 + item.column)}">
                        <h2 class="item-name mdc-typography--headline2">${item.name}</h2>
                    </div>`;
            }
        }))
        .catch(error => console.log("Error getting documents: ", error));
}

function fetchPartners() {
    const partnersContainer = document.getElementById('partners-container');
    db.collection('partners')
        .get()
        .then(querySnapshot => querySnapshot.forEach(doc => {
            const partner = doc.data();
            partnersContainer.innerHTML += `<div class="logo-container">
                <a href="${partner.url}" class="logo-link" target="_blank">
                    <img class="logo" src="${partner.imageUrl}" alt="${partner.name}">
                </a>
            </div`;
        }))
        .catch(error => console.log("Error getting documents: ", error));
}