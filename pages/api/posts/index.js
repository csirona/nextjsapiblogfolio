import { readData, writeData } from '../../../lib/data';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const posts = readData();
    res.status(200).json(posts);
  } else if (req.method === 'POST') {
    const { title, description, content, section, tag, gitlink } = req.body;
    const posts = readData();
    const newPost = {
      id: posts.length + 1,
      title,
      description,
      content,
      section,
      tag,
      gitlink,
      created_at: new Date().toISOString(),
    };
    posts.push(newPost);
    writeData(posts);
    res.status(201).json(newPost);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
