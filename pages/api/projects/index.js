import fs from 'fs';
import path from 'path';

// Middleware to handle CORS
const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

const handler = async (req, res) => {
  const filePath = path.join(process.cwd(), 'data', 'projects.json');

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
    console.log('Received POST request');
    console.log('Request body:', req.body); // Verifica que estás recibiendo los datos esperados
    const { title, description, tag, gitlink } = req.body;
    const newProject = { title, description, tag, gitlink };
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const projects = JSON.parse(fileContents);
    const updatedProjects = [...projects, newProject];
    fs.writeFileSync(filePath, JSON.stringify(updatedProjects, null, 2));
    res.status(201).json({ message: 'Project added successfully.' });
  } catch (error) {
    console.error('Error handling POST request:', error);
    res.status(500).json({ error: 'Could not add project.' });
  }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      const fileContents = fs.readFileSync(filePath, 'utf8');
      let projects = JSON.parse(fileContents);
      projects = projects.filter(project => project.id !== id);
      fs.writeFileSync(filePath, JSON.stringify(projects, null, 2));
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Could not delete project.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default allowCors(handler);
