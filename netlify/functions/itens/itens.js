require('dotenv').config();

import { Client, fql, FaunaError } from "fauna";
const client = new Client({
    secret: process.env.FAUNADB_SECRET
});

const {response} = require("express");


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
            const query = fql`
                Itens{
                  nome,
                  descricao
                }`;

            // Run the query
            const response = await client.query(query);
            console.log(response.data);

        } catch (error) {
            if (error instanceof FaunaError) {
                console.log(error);
            }
        } finally {
            // Clean up any remaining resources
            client.close();
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
