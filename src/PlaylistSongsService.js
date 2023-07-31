const { Pool } = require('pg');
     
class PlaylistSongsService {
  constructor() {
    this.pool = new Pool();
  }

  async getPlaylistSongs(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM playlist_songs
      LEFT JOIN songs ON songs.id = playlist_songs.song_id
      WHERE playlist_songs.playlist_id = $1
      GROUP BY songs.id`,
      values: [playlistId],
    };

    const { rows } = await this.pool.query(query);
    
    return rows;
  }
}

module.exports = PlaylistSongsService;
