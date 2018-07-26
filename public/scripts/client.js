// Options
const CLIENT_ID = '401488104542-c4ks55tsssfmjtq12f8p098rj9bagi45.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];

// Authorization scopes required by the API. If using multiple scopes,
// separated them with spaces.
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');
const content = document.getElementById('content');
const channelForm = document.getElementById('channel-form');
const channelInput = document.getElementById('channel-input');
const videoContainer = document.getElementById('video-container');

const defaultChannel = 'techguyweb';

// Form Submit and Change Channel
channelForm.addEventListener('submit', e => {
  e.preventDefault();
  const channel = channelInput.value;
  getChannel(channel);
});

// Load Auth2 Library
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

// Initialize API client library and set up sign in listeners
function initClient() {
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(() => {
    // Listen for sign in state changes
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    // Handle initial sign in state
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    // Handle clicks of sign in and out button
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}

// Update UI sign in state changes
function updateSigninStatus(isSignedIn) {
  if(isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    content.style.display = 'block';
    videoContainer.style.display = 'block';
    getChannel(defaultChannel);
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    content.style.display = 'none';
    videoContainer.style.display = 'none';
  }
}

// Handle Login
function handleAuthClick() {
  gapi.auth2.getAuthInstance().signIn();
}

// Handle Logout
function handleSignoutClick() {
  gapi.auth2.getAuthInstance().signOut();
}

// Display Channel Data
function showChannelData(data) {
  const channelData = document.getElementById('channel-data');
  channelData.innerHTML = data;
}

// Get Channel from API
function getChannel(channel) {
  console.log(channel);
  gapi.youtube.client.channels.list({
    part: 'snippet, contentDetails, statistics',
    forUsername: channel
  })
  .then(response => {
    console.log(response);
    const channel = response.result.items[0];
    const output = `
      <ul class="collection">
        <li class="collection-item">Title: ${channel.snippet.title}</li>
        <li class="collection-item">ID: ${channel.id}</li>
        <li class="collection-item">Subscribers: ${channel.statistics.subscriberCount}</li>
        <li class="collection-item">views: ${channel.statistics.viewCount}</li>
        <li class="collection-item">Videos: ${channel.statistics.videoCount}</li>
      </ul>
      <p>${channel.snippet.description}</p>
      <hr>
      <a class="btn grey darken-2" target="_blank" href="https://youtube.com/${channel.snippet.customUrl}">Visit Channel</a>
    `;
    showChannelData(output);
  })
  .catch(err => alert('No Channel By That Name'));
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d)/g, ","));
};
