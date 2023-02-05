const APIController = (function() {



    // private methods
    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic ' + btoa( clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }

    const _getGenres = async (token) => {

        const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.categories.items;
    }

    const _getPlaylistInfo = async (token, playlist_url) => {
        
        const id = playlist_url.split("/").pop().split("?")[0];

        const result = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        })

        const data = await result.json();
        return data
    }

    const _getPlaylistByGenre = async (token, genreId) => {

        const limit = 20;

        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.playlists.items;
    }

    const _getTracks = async (token, tracksEndPoint) => {

        const limit = 30;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.items;
    }

    const _getPlaylist = async (token, genreId, trackEndPoint) => {

        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.playlists.items[trackEndPoint];
    }

    const _getPlaylistTracks = async (token, id) => {

        const result = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.items;
    }

    const _getTrack = async (token, trackEndPoint) => {

        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        },
        getPlaylistInfo(token, playlist_url) {
            return _getPlaylistInfo(token, playlist_url);
        },
        getPlaylistTracks(token, id) {
            return _getPlaylistTracks(token, id);
        },
        getPlaylist(token, genreId, trackEndPoint) {
            return _getPlaylist(token, genreId, trackEndPoint);
        }
    }
})();


// UI Module
const UIController = (function() {

    //object to hold references to html selectors
    const DOMElements = {
        selectGenre: '#select_genre',
        selectPlaylist: '#select_playlist',
        playlistUrl: '#playlist_url',
        divPlaylistDetail: '#playlist-detail',
        buttonSubmit: '#btn_submit',
        divSongDetail: '#song-detail',
        hfToken: '#hidden_token',
        divSonglist: '.song-list',
    }

    //public methods
    return {

        //method to get input fields
        inputField() {
            return {
                genre: document.querySelector(DOMElements.selectGenre),
                playlist: document.querySelector(DOMElements.selectPlaylist),
                tracks: document.querySelector(DOMElements.divSonglist),
                playlist_url: document.querySelector(DOMElements.playlistUrl),
                playlistDetail: document.querySelector(DOMElements.divPlaylistDetail),
                submit: document.querySelector(DOMElements.buttonSubmit),
                songDetail: document.querySelector(DOMElements.divSongDetail)
            }
        },

        // need methods to create select list option
        createGenre(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
        },

        createPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
        },

        // need method to create a track list group item
        createTrack(id, name, img, artist) {
            const html = `<a href="#" class="list-group-item list-group-item-action" id="${id}"><img src="${img}" alt="" width="80" height="80" align="left"><div style = "position:relative; left:20px; font-weight:bold; color: white;">${name}</div><div style = "position:relative; left:20px; font-size: 20px;">${artist}</div></a>`;
            document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
        },

        // need method to create the song detail
        createTrackDetail(img, title, artist) {

            const detailDiv = document.querySelector(DOMElements.divSongDetail);
            // any time user clicks a new song, we need to clear out the song detail div
            detailDiv.innerHTML = '';

            const html =
            `
            <div class="row col-sm-12 px-0">
                <img src="${img}" alt="">
            </div>
            <div class="row col-sm-12 px-0">
                <label for="Genre" class="form-label col-sm-12">${title}:</label>
            </div>
            <div class="row col-sm-12 px-0">
                <label for="artist" class="form-label col-sm-12">By ${artist}:</label>
            </div>
            `;

            detailDiv.insertAdjacentHTML('beforeend', html)
        },

        createPlaylistInfo(title, img, user) {

            const detailDiv = document.querySelector(DOMElements.divPlaylistDetail);
            detailDiv.innerHTML = '';

            const html = 
            `
            <container style="position: fixed; left: 800px; top: 8%">
                <div class="row col-sm-12 px-0">
                    <h1 style="position: fixed; left: 900px">Searched Playlist</h1>
                </div>
                <div class="row col-sm-12 px-0">
                    <img src="${img}" alt="" style="position: fixed; width: 200px; length: 200px; padding: 10px; left: 960px">
                </div>
                <div class="row col-sm-12 px-0">
                    <label for="Genre" class="form-label col-sm-12" style="position: fixed; left: 1000px; bottom: 62%">Playlist: ${title}</label>
                </div>
                <div class="row col-sm-12 px-0">
                    <label for="User" class="form-label col-sm-12" style="position: fixed; left: 1000px; bottom: 58%">User: ${user}</label>
                </div>
                <h3 style='position:absolute; color:white; font-size: 25px; left: 20px; bottom: -310px'>Tracks: </h3>
            </container>
            `;

            detailDiv.insertAdjacentHTML('beforeend', html)
        },

        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = '';
        },

        resetTracks() {
            this.inputField().tracks.innerHTML = '';
            this.resetTrackDetail();
        },

        resetPlaylist() {
            this.inputField().playlist.innerHTML = '';
            this.resetTracks();
        },

        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },

        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            }
        },

        clearSearched() {
            document.querySelector(DOMElements.playlistUrl).value = '';
        },

        resetPlaylistInfo() {
            this.inputField().playlistDetail.innerHTML = '';
        }
    }

})();

const APPController = (function(UICtrl, APICtrl) {

    // get input field object ref
    const DOMInputs = UICtrl.inputField();

    // get genres on page load
    const loadGenres = async () => {
        //get the token
        const token = await APICtrl.getToken();
        //store the token onto the page
        UICtrl.storeToken(token);
        //get the genres
        const genres = await APICtrl.getGenres(token);
        //populate our genres select element
        genres.forEach(element => UICtrl.createGenre(element.name, element.id));
    }

    var genre;

    // create genre change event listener
    DOMInputs.genre.addEventListener('change', async () => {
        //reset the playlist
        UICtrl.resetPlaylist();
        UICtrl.clearSearched();
        UICtrl.resetPlaylistInfo();
        //get the token that's stored on the page
        const token = UICtrl.getStoredToken().token;
        // get the genre select field
        const genreSelect = UICtrl.inputField().genre;
        // get the genre id associated with the selected genre
        const genreId = genreSelect.options[genreSelect.selectedIndex].value;
        genre = genreId;
        // ge the playlist based on a genre
        const playlist = await APICtrl.getPlaylistByGenre(token, genreId);
        // create a playlist list item for every playlist returned
        playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
    });

    // create submit button click event listener
    DOMInputs.submit.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        // clear tracks
        UICtrl.resetTracks();
        //get the token
        const token = UICtrl.getStoredToken().token;
        // get url field
        const playlistLink = UICtrl.inputField().playlist_url.value;
        // if (playlistLink)
        UICtrl.clearSearched();
        if (playlistLink.length != 0) {
            UICtrl.resetPlaylistInfo();
            // get playlist info
            const info = await APICtrl.getPlaylistInfo(token, playlistLink);
            // get playlist info printout
            UICtrl.createPlaylistInfo(info.name, info.images[0].url, info.owner.display_name);
            // get playlist tracks
            const ptracks = await APICtrl.getPlaylistTracks(token, info.id);
            // create playlist track items
            ptracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name, el.track.album.images[2].url, el.track.artists[0].name))
        } else {
            // get the playlist field
            const playlistSelect = UICtrl.inputField().playlist;
            // get track endpoint based on the selected playlist
            const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
            // get the playlist info
            const info = await APICtrl.getPlaylist(token, genre, playlistSelect.selectedIndex);
            UICtrl.createPlaylistInfo(info.name, info.images[0].url, info.owner.display_name);
            // get the list of tracks
            const tracks = await APICtrl.getTracks(token, tracksEndPoint);
            // create a track list item
            tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name, el.track.album.images[2].url, el.track.artists[0].name))
        }
    });

    // create song selection click event listener
    DOMInputs.tracks.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        // get the token
        const token = UICtrl.getStoredToken().token;
        // get the track endpoint
        const trackEndpoint = e.target.id;
        //get the track object
        const track = await APICtrl.getTrack(token, trackEndpoint);
        window.open(track.external_urls['spotify'])
    });

    return {
        init() {
            console.log('App is starting');
            loadGenres();
        }
    }

})(UIController, APIController);

// will need to call a method to load the genres on page load
APPController.init();