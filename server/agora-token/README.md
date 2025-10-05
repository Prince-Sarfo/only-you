# Agora Token Server Template

This folder contains a minimal example of an Agora token server.

You can deploy it as a serverless function or a simple Node/Express server. The client will call:

GET /token?channel=<CHANNEL_ID>&uid=<UID_OPTIONAL>&role=<publisher|subscriber>

Response JSON:
{
  "token": "AGORA_RTC_TOKEN_STRING",
  "uid": 0
}

- token: A valid RTC token for the requested channel and uid
- uid: The numeric uid used (0 means let Agora assign)

## Node (Express) example

```js
import express from 'express';
import cors from 'cors';
import { RtcRole, RtcTokenBuilder } from 'agora-access-token';

const app = express();
app.use(cors());

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERT = process.env.AGORA_APP_CERTIFICATE; // required when generating tokens

app.get('/token', (req, res) => {
  const channelName = String(req.query.channel || 'onlyyou');
  const uid = Number(req.query.uid || 0);
  const roleParam = String(req.query.role || 'publisher');
  const role = roleParam === 'subscriber' ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;

  const expireSeconds = 3600; // 1 hour
  const privilegeExpireTs = Math.floor(Date.now() / 1000) + expireSeconds;

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERT, channelName, uid, role, privilegeExpireTs);
    res.json({ token, uid });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create token' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Token server running on :${port}`));
```

## Serverless (Next.js API Route) example

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { RtcRole, RtcTokenBuilder } from 'agora-access-token';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { channel = 'onlyyou', uid = '0', role = 'publisher' } = req.query;
  const appId = process.env.AGORA_APP_ID!;
  const appCert = process.env.AGORA_APP_CERTIFICATE!;

  const expireSeconds = 3600;
  const privilegeExpireTs = Math.floor(Date.now() / 1000) + expireSeconds;

  const rtcRole = role === 'subscriber' ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;
  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCert,
    String(channel),
    Number(uid),
    rtcRole,
    privilegeExpireTs
  );

  res.status(200).json({ token, uid: Number(uid) });
}
```

## Client configuration
- Set `EXPO_PUBLIC_AGORA_TOKEN_ENDPOINT` to your deployed `/token` URL.
- The app will call `?channel=<pairing_code_or_roomId>` and use `token` from the response.
