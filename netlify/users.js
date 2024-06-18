exports.handler = async (event, context) => {
  if (event.httpMethod === 'GET') {

    return {
      statusCode: 200,
      body: JSON.stringify('ola mundo')
    };
  } else if (event.httpMethod === 'POST') {
    // Lógica para adicionar um novo usuário
    const newUser = JSON.parse(event.body);
    return {
      statusCode: 201,
      body: `Usuário ${newUser.name} criado com sucesso!`
    };
  }
};