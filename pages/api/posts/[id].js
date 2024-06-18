import { readData, writeData } from '../../../lib/data';

export default function handler(req, res) {
  const { id } = req.query;
  const posts = readData();
  const postIndex = posts.findIndex((post) => post.id === parseInt(id));

  if (req.method === 'GET') {
    if (postIndex !== -1) {
      res.status(200).json(posts[postIndex]);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } else if (req.method === 'PUT') {
    if (postIndex !== -1) {
      const { title, description, content, section, tag, gitlink } = req.body;
      posts[postIndex] = {
        ...posts[postIndex],
        title,
        description,
        content,
        section,
        tag,
        gitlink,
        updated_at: new Date().toISOString(),
      };
      writeData(posts);
      res.status(200).json(posts[postIndex]);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } else if (req.method === 'DELETE') {
    if (postIndex !== -1) {
      posts.splice(postIndex, 1);
      writeData(posts);
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
