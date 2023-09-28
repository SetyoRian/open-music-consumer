const { Pool } = require('pg');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylist(userId, playlistId) {
    const query = {
      text: `
      SELECT
      playlists.id AS playlist_id,
      playlists.name AS playlist_name,
      songs.id AS song_id,
      songs.title AS song_title,
      songs.performer AS song_performer
      FROM
      playlists
      JOIN
      playlist_songs ON playlists.id = playlist_songs.playlist_id
      JOIN
      songs ON playlist_songs.song_id = songs.id
      WHERE
      playlists.id = $1 AND playlists.owner = $2`,
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    const res = {
      playlist: {
        id: result.rows[0].playlist_id,
        name: result.rows[0].playlist_name,
        songs: [],
      },
    };

    result.rows.forEach((element) => {
      const temp = {
        id: element.song_id,
        title: element.song_title,
        performer: element.song_performer,
      };
      res.playlist.songs.push(temp);
    });
    return res;
  }
}

module.exports = PlaylistService;
