import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'about.json');

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'GET') {
    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContents);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Could not read data file.' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, description, content } = req.body;
      const newData = { title, description, content };
      fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
      res.status(201).json({ message: 'Data written to file.' });
    } catch (error) {
      res.status(500).json({ error: 'Could not write data to file.' });
    }
  } else if (req.method === 'DELETE') {
    try {
      fs.unlinkSync(filePath);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Could not delete data file.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
