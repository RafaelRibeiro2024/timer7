module.exports = async function (context, myTimer) {
	const { CosmosClient } = require("@azure/cosmos");
    var timeStamp = new Date().toISOString();
    
    if (myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }
    context.log('JavaScript timer trigger function ran!', timeStamp);   
	
	        const endpoint = "https://project-rrj-database.documents.azure.com:443/";
        const key = "cqEkzC1PmhJuTDG9XMgicZbx5PZcwSwPpA06T2rwnFKKzZbp73UtecVBylBkH3kSSwos0JwpY9G7ACDbLcPwAA==";
        const databaseId = 'Eventos';
        const containerId = 'Evento';

        const client = new CosmosClient({ endpoint, key });
        const database = client.database(databaseId);
        const container = database.container(containerId);

        const currentDate = new Date();

        try {
            const { resources: items } = await container.items.readAll().fetchAll();

            for (const item of items) {
                const endDate = new Date(item.end_date);
                
                if (endDate < currentDate) {
                    context.log(`A data fim para o item ${item.id} (${item.nome}) passou.`);
                }
            }
        } catch (error) {
            context.log.error('Erro ao consultar os itens:', error.message);
        }
};
