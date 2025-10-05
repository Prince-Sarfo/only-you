import express from 'express';
import cors from 'cors';
import { RtcRole, RtcTokenBuilder } from 'agora-access-token';

const app = express();
app.use(cors());

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERT = process.env.AGORA_APP_CERTIFICATE;

app.get('/token', (req, res) => {
  const channelName = String(req.query.channel || 'onlyyou');
  const uid = Number(req.query.uid || 0);
  const roleParam = String(req.query.role || 'publisher');
  const role = roleParam === 'subscriber' ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;

  const expireSeconds = 3600;
  const privilegeExpireTs = Math.floor(Date.now() / 1000) + expireSeconds;

  try {
    if (!APP_ID || !APP_CERT) throw new Error('Missing AGORA_APP_ID or AGORA_APP_CERTIFICATE');
    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERT, channelName, uid, role, privilegeExpireTs);
    res.json({ token, uid });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create token' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Token server running on :${port}`));
