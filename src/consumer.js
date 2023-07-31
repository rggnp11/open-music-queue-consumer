require('dotenv').config();

const log = require('npmlog');
const amqp = require('amqplib');
const PlaylistsService = require('./PlaylistsService');
const PlaylistSongsService = require('./PlaylistSongsService');
const MailSender = require('./MailSender');
const Listener = require('./listener');

const init = async () => {
  const playlistsService = new PlaylistsService();
  const playlistSongsService = new PlaylistSongsService();
  const mailSender = new MailSender();
  const listener = new Listener(
    playlistsService,
    playlistSongsService,
    mailSender
  );

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:playlist', {
    durable: true,
  });

  channel.consume('export:playlist', listener.listen, { noAck: true });

  log.info(null, 'Consumer sedang berjalan');
};

init();
