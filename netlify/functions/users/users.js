const faunadb = require('faunadb'),
    q = faunadb.query;

const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

const headers = {
  'Access-Control-Allow-Origin': '*', // Permite acesso de qualquer domínio
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
};

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    // Retorna os cabeçalhos para requisições de preflight do CORS
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod === 'GET') {
    try {
      // Exemplo: buscar todos os registros de uma coleção
      const result = await client.query(
          q.Paginate(q.Match(q.Index('nome_do_indice')))
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result)
      };
    } catch (error) {
      console.error('Erro ao conectar ao FaunaDB:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Erro interno do servidor" })
      };
    }
  } else if (event.httpMethod === 'POST') {
    try {
      const newUser = JSON.parse(event.body);

      // Exemplo: criar um novo registro na coleção
      const result = await client.query(
          q.Create(q.Collection('nome_da_colecao'), { data: newUser })
      );

      return {
        statusCode: 201,
        headers,
        body: `Usuário ${newUser.name} criado com sucesso!`
      };
    } catch (error) {
      console.error('Erro ao criar usuário no FaunaDB:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Erro interno do servidor" })
      };
    }
  }

  // Se o método HTTP não for nem GET nem POST, retorna um erro 405 Method Not Allowed
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Método não permitido" })
  };
};
