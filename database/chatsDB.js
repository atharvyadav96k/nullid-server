const {GetCommand, PutCommand, DeleteCommand, ScanCommand, dynamoClient} = require('./dynamoDB');
const { v4: uuidv4 } = require('uuid');
const TABLE_NAME = 'chats';


exports.saveChats = async (chat, backdoor)=>{
    const params = new PutCommand({
        TableName: TABLE_NAME,
        Item: {
            id: `chat-${uuidv4()}`,
            message: chat,
            backdoor_name: backdoor
        }
    });
    const res = await dynamoClient.send(params);
    return res;
}