const bcrypt = require('bcrypt');
const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const cors = require('cors');
const csvtojson = require("csvtojson");

const { PrismaClient } = require('@prisma/client');

require('dotenv').config();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn'],
});

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

const checkJwt = expressJwt({
  secret: process.env.SECRET_KEY,
  algorithms: ['HS256'],
});

const asyncWrapper = (handler, logMessage) => {
  return async (req, res, next) => {
    try {
      console.log("Handling request:", req.method, req.path);  // Add log
      await handler(req, res, next);
      if (logMessage) {
        await prisma.log.create({
          data: {
            action: logMessage,
            userId: req.user?.id,
          },
        });
      }
    } catch (error) {
      console.log("Caught an error:", error);  // Add log
      handleError(res, 'An error occurred', error);
    }
  };
};

const handleError = (res, message, error, statusCode = 500) => {
  console.log("Handling error:", error);  // Add log
  if (res.headersSent) {
    console.log("Headers already sent, cannot handle error");  // Add log
    return;
  }
  return res.status(statusCode).json({ message, error: error.message });
};

function ensureRole(role, permissions, type) {
  return function (req, res, next) {
    if(typeof(role) != "object"){
      role = [role]
    }

    if(permissions){
      if(!(req.user?.role == 'ADMIN') && !permissions.includes(type)){
        return handleError(res, 'Access denied (1)', {}, 403);
      }
    }

    role.push("ADMIN")

    if (!role.includes(req.user?.role)) {
      return handleError(res, 'Access denied (2)', {}, 403);
    }

    next();
  };
}

app.use((req, res, next) => {
  const oldJson = res.json;

  res.json = function (data) {
    return oldJson.call(this, JSON.parse(JSON.stringify(data, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )));
  };

  next();
});

app.post('/login', asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return handleError(res, 'Invalid credentials', {}, 401);
  }
  const token = jsonwebtoken.sign({ id: BigInt(user.id).toString(), email, role: user.role, companyId: BigInt(user.companyId).toString() }, process.env.SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
}, 'User logged in'));

app.get('/getUserData', checkJwt, asyncWrapper(async (req, res) => {
  res.json({ user: req.user });
}));

async function convertToJSON(input) {
  try {
    const jsonArray = JSON.parse(input);
    return jsonArray;
  } catch (err) {
    // Se não for possível converter, lança um erro
    throw new Error("Invalid input format. Expected CSV or JSON." + err.message);
  }
}


app.get('/getDashboardData', checkJwt, ensureRole('USER'), asyncWrapper(async (req, res) => {
  try {
    // input
    let id = BigInt(req.query.id);
    let dashboard = await prisma['dashboard'].findMany({ where: { id: id } });

    // process
    if ((req.user.role !== 'ADMIN') && (dashboard[0].companyId) != req.user.companyId) {
      throw new Error("Access denied for dashboard");
    }

    let dashboardJSONData = await convertToJSON(dashboard[0].dashboardData);
    
    let indicatorIds = [];
    for (let i = 0; i < dashboardJSONData.length; i++) {
      if (dashboardJSONData[i].INDICATOR_ID) {
        indicatorIds.push(BigInt(dashboardJSONData[i].INDICATOR_ID));
      }
    }

    let indicators = await prisma['indicator'].findMany({ where: { id: { in: indicatorIds } } });

    let indicatorData = [];
    for (let i = 0; i < indicators.length; i++) {
      indicators[i].formulaParsed = await convertToJSON(indicators[i].formulaData);
      indicators[i].equivalentFieldsParsed = await convertToJSON(indicators[i].equivalentFieldsData);
      indicatorData.push(indicators[i]);
    }

    let datasets = await prisma['dataset'].findMany({ where: { companyId: BigInt(dashboard[0].companyId) } });

    let datasetsData = [];
    for (let i = 0; i < datasets.length; i++) {
      datasets[i].dataParsed = await convertToJSON(datasets[i].data);
      datasetsData.push(datasets[i]);
    }

    // output
    res.json({ dashboard, indicatorData, datasetsData });
  } catch (e) {
    throw new Error(e);
  }
}));


// Função para criar rotas CRUD genéricas
const createCrudRoutes = (modelName, logActionPrefix, role="ADMIN", permissions=["GET", "POST", "PUT", "DELETE"]) => {
  // Rota para criar um novo item
  app.post(`/${modelName.toLowerCase()}`, checkJwt, ensureRole(role, permissions, 'POST'), asyncWrapper(async (req, res) => {
    const { relations, ...data } = req.body; // Separa os dados relacionais e os dados principais
    
    if(req.user.role == 'USER' && req.body.companyId != req.user.companyId){
      throw new Error("Invalid company ID for user");
      return false;
    }

    const createData = {
      ...data,
      ...Object.keys(relations || {}).reduce((acc, key) => {
        acc[key] = { connect: relations[key] }; // Usa 'connect' para relacionar com um registro existente
        return acc;
      }, {}),
    };
    const newItem = await prisma[modelName].create({ data: createData });
    res.status(201).json(newItem);
  }, `${logActionPrefix} Created`));

  // Rota para buscar todos os itens
  app.get(`/${modelName.toLowerCase()}`, checkJwt, ensureRole(role, permissions, 'GET'), asyncWrapper(async (req, res) => {
    let options = {};
    if(req.user.role == 'USER'){
      options.companyId == BigInt(req.user.companyId);
    }
    const items = await prisma[modelName].findMany(options);
    res.json(items);
  }, `${logActionPrefix} Fetched`));

  // Rota para atualizar um item pelo ID
  app.put(`/${modelName.toLowerCase()}/:id`, checkJwt, ensureRole(role, permissions, 'PUT'), asyncWrapper(async (req, res) => {
    const id = BigInt(req.params.id);
    const { relations, ...data } = req.body; // Separa os dados relacionais e os dados principais

    if(req.user.role == Object.keys('USER') && req.body.companyId != req.user.companyId){
      throw new Error("Invalid company ID for user");
      return false;
    }

  
    // Prepara os dados relacionais para serem atualizados
    const updateRelations = Object.keys(relations || {}).reduce((acc, key) => {
      acc[key] = { connect: relations[key] }; // Usa 'connect' para relacionar com um registro existente
      return acc;
    }, {});
  
    const updatedItem = await prisma[modelName].update({
      where: { id },
      data: {
        ...data,
        ...updateRelations // Inclui os dados relacionais
      },
    });
    
    res.json(updatedItem);
  }, `${logActionPrefix} Edited`));

  // Rota para deletar um item pelo ID
  app.delete(`/${modelName.toLowerCase()}/:id`, checkJwt, ensureRole(role, permissions, 'DELETE'), asyncWrapper(async (req, res) => {
    const id = BigInt(req.params.id);
    let data = await prisma[modelName].findUnique({ where: { id } });

    if(req.user.role == 'USER' && data.companyId != req.user.companyId){
      throw new Error("Invalid company ID for user");
      return false;
    }

    await prisma[modelName].delete({ where: { id } });
    res.status(204).send();
  }, `${logActionPrefix} Deleted`));
};

// Criar as rotas CRUD para cada modelo
createCrudRoutes('User', 'User');
createCrudRoutes('Announcement', 'Announcement', 'USER', ['GET']);
createCrudRoutes('Log', 'Log');
createCrudRoutes('Dashboard', 'Dashboard', 'USER', ['GET']);
createCrudRoutes('Company', 'Company');
createCrudRoutes('Dataset', 'Dataset', 'USER');
createCrudRoutes('Indicator', 'Indicator');

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => console.log(`Server started on :${PORT}`));
