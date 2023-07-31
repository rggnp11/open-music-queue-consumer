const log = require('npmlog');

class Listener {
  constructor(playlistsService, playlistSongsService, mailSender) {
    this.playlistsService = playlistsService;
    this.playlistSongsService = playlistSongsService;
    this.mailSender = mailSender;
 
    this.listen = this.listen.bind(this);
  }
 
  async listen(message) {
    try {
      const { playlistId: id, targetEmail } = JSON.parse(
        message.content.toString()
      );
      
      const playlist = await this.playlistsService.getPlaylistById(id);
      const songs = await this.playlistSongsService.getPlaylistSongs(id);

      playlist.songs = songs;

      const result = await this.mailSender.sendEmail(
        targetEmail,
        JSON.stringify({playlist})
      );

      log.info('result', result);
    } catch (error) {
      log.error(null, error);
    }
  }
}
 
module.exports = Listener;