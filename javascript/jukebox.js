const records = [
  {
    title: "Tank!",
    artist: "The Seatbelts",
    description: "Intro from Cowboy Bebop. Jazzy, energetic, iconic.",
    cover: "https://upload.wikimedia.org/wikipedia/en/7/79/Cowboy_Bebop_soundtrack.jpg",
    link: "https://www.youtube.com/watch?v=n6jCJZEFIto"
  },
  {
    title: "Again",
    artist: "YUI",
    description: "Opening from Fullmetal Alchemist: Brotherhood.",
    cover: "https://upload.wikimedia.org/wikipedia/en/c/c4/Yui_-_Again.jpg",
    link: "https://www.youtube.com/watch?v=K0HSD_i2DvA"
  },
  {
    title: "Unravel",
    artist: "TK from Ling Tosite Sigure",
    description: "Opening of Tokyo Ghoul. A modern classic.",
    cover: "https://upload.wikimedia.org/wikipedia/en/0/0f/Unravel.jpg",
    link: "https://www.youtube.com/watch?v=7aMOurgDB-o"
  }
];

const jukebox = document.getElementById('jukebox');
const modal = document.getElementById('record-info-modal');
const modalTitle = document.getElementById('record-title');
const modalDesc = document.getElementById('record-desc');
const modalCover = document.getElementById('record-cover');
const modalLink = document.getElementById('record-link');
const closeBtn = document.querySelector('.close-btn');

records.forEach((record, index) => {
  const div = document.createElement('div');
  div.classList.add('record');
  div.setAttribute('data-index', index);
  jukebox.appendChild(div);
});

jukebox.addEventListener('click', (e) => {
  if (e.target.classList.contains('record')) {
    const index = e.target.getAttribute('data-index');
    const data = records[index];

    modalTitle.innerText = `${data.title} – ${data.artist}`;
    modalDesc.innerText = data.description;
    modalCover.src = data.cover;
    modalLink.href = data.link;

    modal.classList.remove('hidden');
  }
});

closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = 'undefined';
async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}

async function getTopTracks(){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (await fetchWebApi(
    'v1/me/top/tracks?time_range=long_term&limit=5', 'GET'
  )).items;
}

const topTracks = await getTopTracks();
console.log(
  topTracks?.map(
    ({name, artists}) =>
      `${name} by ${artists.map(artist => artist.name).join(', ')}`
  )
);