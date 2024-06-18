require('dotenv').config();

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


    const items = [
        {
            nome: "Item 1",
            descricao: "Descrição do Item 1",
            qtd: 10,
            kgl: "2.5kg",
            dataValidade: q.Date("2024-06-30"),
            categoria: "Alimentos",
            created_at: q.Now()
        },
        {
            nome: "Item 2",
            descricao: "Descrição do Item 2",
            qtd: 5,
            kgl: "1kg",
            dataValidade: q.Date("2024-12-31"),
            categoria: "Bebidas",
            created_at: q.Now()
        }
        // Adicione mais itens conforme necessário
    ];


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
