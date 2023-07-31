const { Pool } = require('pg');
const NotFoundError = require('./NotFoundError');
     
class PlaylistsService {
  constructor() {
    this.pool = new Pool();
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    
    const { rows, rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('ID tidak ditemukan');
    }
    
    return rows[0];
  }
}

module.exports = PlaylistsService;
