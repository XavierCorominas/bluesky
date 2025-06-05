import { BskyAgent } from '@atproto/api';
import fs from 'fs';

async function exportPosts() {
  const agent = new BskyAgent({ service: 'https://bsky.social' });
  await agent.login({
    identifier: 'xavier-ct.bsky.social',   // Your Bluesky handle
    password: process.env.BLUESKY_PASSWORD  // Password from GitHub secret
  });

  const feed = await agent.getAuthorFeed({ actor: 'xavier-ct.bsky.social' });

  const latestPosts = feed.data.feed.map(item => ({
    text: item.post.record.text,
    date: item.post.record.createdAt,
  }));

  fs.writeFileSync('sourcej.json', JSON.stringify(latestPosts, null, 2));
  console.log('sourcej.json updated!');
}

exportPosts().catch(err => {
  console.error('Failed to export posts:', err);
  process.exit(1);
});
