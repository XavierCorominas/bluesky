import pkg from '@atproto/api';
import fs from 'fs';

const { BskyAgent } = pkg;

async function exportPosts() {
  const agent = new BskyAgent({ service: 'https://bsky.social' });
  await agent.login({
    identifier: 'xavier-ct.bsky.social',
    password: process.env.BLUESKY_PASSWORD,
  });

  const feed = await agent.getAuthorFeed({ actor: 'xavier-ct.bsky.social' });

  const latestPosts = feed.data.feed.map(item => {
    const record = item.post.record;
    let images = [];

    if (record.embed && record.embed.$type === 'app.bsky.embed.images') {
      images = record.embed.images.map(img => {
        const cid = img.image.ref['$link'];
        return `https://cdn.bsky.app/img/feed_full/${cid}@jpeg`;
      });
    }

    return {
      text: record.text,
      date: record.createdAt,
      images: images,
    };
  });

  fs.writeFileSync('sourcej.json', JSON.stringify(latestPosts, null, 2));
  console.log('sourcej.json updated with images!');
}

exportPosts().catch(err => {
  console.error('Failed to export posts:', err);
  process.exit(1);
});
