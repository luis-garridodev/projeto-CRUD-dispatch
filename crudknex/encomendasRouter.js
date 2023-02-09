const { Router } = require('express');
const connection = require('../db');

const encomendasRoutes = Router();


encomendasRoutes.post('/', async (req, res) => {
    const { user_id, companie_id, avaliable_at, delivered_at, code } = req.body;

    try {
        const verificacao = await connection('companies').select('id').where('id', companie_id).first()


        if (!verificacao) {

            throw new MinhaExcessao(500, 'dado de empresa inexistente')
        }


        const insercaod = await connection('encomendas').insert({ user_id, companie_id, code });


        console.log(insercaod);


        console.log("olá");

        return res.status(200).json({ message: "tudo ok!", insercaod });
    } catch (error) {
        console.log(JSON.stringify(error))

        return res.status(error.status ? error.status : 500).send(error.message);


    }

})

encomendasRoutes.get('/:companie_id/disponiveis', async (req, res) => {
    try {
        const { companie_id } = req.params;

        const selecao = await connection('encomendas').select('*').where('companie_id', companie_id).whereNotNull('avaliable_at');
        console.log(selecao)
        if (selecao.length == 0) {

            throw new MinhaExcessao(500, 'nenhum conteudo')
        }

        return res.status(200).json({ message: "erro interno no servidor", selecao });
    } catch (error) {
        return res.status(error.status ? error.status : 500).send(error.message);
    }
})
encomendasRoutes.get('/entregues/:companie_id', async (req, res) => {
    {
        try {
            const { companie_id } = req.params;


            const selecao = await connection('encomendas').select('*').where('companie_id', companie_id).whereNotNull('delivered_at');
            console.log(selecao)
            if (selecao.length == 0) {

                throw new MinhaExcessao(404, 'NOT FOUND')
            }

            return res.status(200).json({ message: "código de encomenda achado!está disponivel", selecao });
        } catch (error) {
            return res.status(error.status ? error.status : 404).send(error.message);
        }



    }
})
encomendasRoutes.put('/criarentrega/:companie_id', async (req, res) => {
    try {
        const { companie_id } = req.params;
        const verificacao = await connection('companies').select('id').where('id', companie_id).first()
      
        if (verificacao.length == 0) {

            throw new MinhaExcessao(500, 'erro interno no servidor')
        }
        const insercaod = await connection('encomendas').update(({ delivered_at :new Date()}));
        console.log(insercaod)
        return res.status(200).json({ message: "código de encomenda achado!está disponivel", insercaod });
    } catch (error) {
        return res.status(error.status ? error.status : 500).send(error.message);
    }
})
encomendasRoutes.put('/criarencomenda/:companie_id', async (req, res) => {
    try {
        const { companie_id } = req.params;
        const verificacao = await connection('companies').select('id').where('id', companie_id).first()
      
        if (verificacao.length == 0) {

            throw new MinhaExcessao(500, 'erro interno no servidor')
        }
        const insercaod = await connection('encomendas').update(({ avaliable_at :new Date()}));
        console.log(insercaod)
        return res.status(200).json({ message: "código de encomenda achado!está disponivel", insercaod });
    } catch (error) {
        return res.status(error.status ? error.status : 500).send(error.message);
    }
})


module.exports = encomendasRoutes;