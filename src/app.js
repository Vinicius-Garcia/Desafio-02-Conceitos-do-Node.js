const express = require("express");
const cors = require("cors");
const {uuid, isUuid} = require("uuidv4")

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(req,res,next) {
  const{id} = req.params;

  if (!isUuid(id)){
      return res.status(400).json({error:"Passou id errado vacilão"})
  }

  return next();
}

app.use('/repositories/:id', validateProjectId)

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {

  const {title, url, techs} = request.body;

  const repositorie = {id:uuid(), title,url, techs, likes:0}

  repositories.push(repositorie);

  return response.json(repositorie);

});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;


  const repositoriesIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositoriesIndex < 0 ){
      return response.status(400).json({error:"Project not found"})
  }


  const repositorie = {id,title,url,techs, likes:repositories[repositoriesIndex].likes}

  repositories[repositoriesIndex] = repositorie;
  return response.json(repositorie)
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repositoriesIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositoriesIndex < 0 ){
      return response.status(400).json({error:"Project not found"})
  }
  repositories.splice(repositoriesIndex,1);

  return response.status(204).send()


});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositoriesIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositoriesIndex < 0 ){
    return response.status(400).json({error:"Project not found"})
}

repositories[repositoriesIndex].likes +=1;

return response.json(repositories[repositoriesIndex])

});

module.exports = app;
