app.get('/', (req, res) => {
    res.send('Bem-vindo à API!');
});


app.get('/api/users', (req, res) => {
    // Aqui você poderia buscar usuários de um banco de dados
    res.json([{ name: 'Usuário 1' }, { name: 'Usuário 2' }]);
});


app.post('/api/users', (req, res) => {
    // Aqui você poderia adicionar um novo usuário ao banco de dados
    const newUser = req.body; // Dados do novo usuário vêm do corpo da requisição
    res.status(201).send(`Usuário ${newUser.name} criado com sucesso!`);
});
