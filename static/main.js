const songsDiv = document.querySelector('.songs');

const api = axios.create({
  baseURL: 'http://localhost:3333'
});

async function getSongs() {
  try {
    return await api.get('/songs').then(result => result.data);
  } catch(err) {
    console.error(err);
    return [];
  }
}

getSongs().then(songs => {
  console.log(songs);

  for(song of songs) {
    songsDiv.innerHTML +=  `<p>${song.artist} - <strong>${song.name}</strong></p>`;
  }
});
