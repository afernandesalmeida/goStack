const express = require('express');
const { uuid, isUuid } = require('uuidv4');
const app = express();
app.use(express.json());

/**
 * Métodos HTTP
 * 
 * GET: buscar informações
 * POST: criar
 * PUT/PATCH: alterar
 * DELETE: deletar
 */

/**
 * Tipos de parâmetros:
 * 
 * Query params: filtros e paginação
 * Route params: alterar ou deletar recurso
 * Request Body:
 */

 /**
  * Middleware:
  * 
  * Interceptador de requisições (interromper ou alterar dados da requisição)
  */

const projects = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;
  
  console.log(logLabel);

  return next();
  
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({error: "Is not a valid ID"});
  }

  return next();

}

app.use('/projects/:id', validateProjectId);

app.use(logRequests);

app.get('/projects', (request, response) => {

  const {title} =  request.query;

  const results = title ? projects.filter(project => project.title.includes(title)) : projects;

  return response.json(results);
});

app.post('/projects', (request, response) => {

  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };

  projects.push(project);

  return response.json(project);

});
app.put('/projects/:id', (request, response) => {

  const { id } = request.params;
  const { title, owner } = request.body;
  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({error: "project not found"})
  }

  const project = {
    id,
    title,
    owner
  };

  projects[projectIndex] = project;

  return response.json(project);

});
app.delete('/projects/:id', (request, response) => {
  
  const { id } = request.params;
  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({error: "project not found"})
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send();


});

app.listen(3333, () => {
  console.log('Backend started! Listening on port 3333')
});