exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*', // Permite acesso de qualquer domínio
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };

  if (event.httpMethod === 'OPTIONS') {
    // Retorna os cabeçalhos para requisições de preflight do CORS
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify('ola mundo')
    };
  } else if (event.httpMethod === 'POST') {
    const newUser = JSON.parse(event.body);
    return {
      statusCode: 201,
      headers,
      body: `Usuário ${newUser.name} criado com sucesso!`
    };
  }

  // Se o método HTTP não for nem GET nem POST, retorna um erro 405 Method Not Allowed
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Método não permitido" })
  };
};
