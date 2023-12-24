const amqp = require('amqplib')
// import config from '../configurl/url-config'
const runProducerFollowShop = async(messages) => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost')
        const channel = await connection.createChannel()

        const queueName = 'follow-shop-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(messages)))  
        setTimeout(() => {
            connection.close()
            // process.exit(0)
        }, 500)
        console.log(`messages sent`, messages);
    } catch (error) {
        console.log(console.log(error));
    }
}

// runProducerFollowShop().catch(console.error)
module.exports = {
    runProducerFollowShop
}
