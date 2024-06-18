require('dotenv').config();

const faunadb = require('faunadb'), q = faunadb.query;
const {response} = require("express");
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });


const headers = {
    'Access-Control-Allow-Origin': '*',
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
            const getResult = await client.query(
                q.Map(
                    q.Paginate(q.Documents(q.Collection('itens'))),
                    q.Lambda('X', q.Get(q.Var('X')))
                )
            );
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(getResult)
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
            items.forEach(item => {
                client.query(
                    q.Create(
                        q.Collection('itens'),
                        { data: item }
                    )
                )
                    .then((response) => console.log(response))
                    .catch((error) => console.error('Error: ', error));
            });

            return {
                statusCode: 201,
                headers,
                body: `Item(s) criado(s) com sucesso!`
            };
        } catch (error) {
            console.error('Erro ao criar item(s) no FaunaDB:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: "Erro interno do servidor" })
            };
        }
    }


    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: "Método não permitido" })
    };
};
