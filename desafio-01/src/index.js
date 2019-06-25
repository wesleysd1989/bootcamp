const express = require('express');

const server = express();

server.use(express.json());

let numberOfRequests = 0;
const projects = [];

function checkIdAndTitle(req, res, next) {
    if (!req.body.id && !req.body.title) {
        return res.status(400).json({ error: 'Id or Title is required' });
    }

    return next();
}

function checkProject(req, res, next) {
    const { id } = req.params;
    const project = projects.find(project => project.id === id);

    if (!project) {
        return res.status(400).json({ error: 'Project not found' });
    }

    return next();
}

function logRequests(req, res, next) {
    numberOfRequests++;
    console.log(`Número de requisições: ${numberOfRequests}`);

    return next();
}

server.use(logRequests);

server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.post('/projects', checkIdAndTitle, (req, res) => {
    const { id, title } = req.body;
    projects.push({ id: id, title: title, tasks: [] });
    return res.json({ projects });
});

server.post('/projects/:id/tasks', checkProject, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    
    const project = projects.find(project => project.id === id);
    project.tasks.push(title);
  
    return res.json(project);
});

server.put('/projects/:id', checkProject, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(project => project.id === id);
    project.title = title;

    return res.json(project);
});

server.delete('/projects/:id', checkProject, (req, res) => {
    const { id } = req.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    projects.splice(projectIndex, 1);
    return res.json();
});
  
server.listen(3000);