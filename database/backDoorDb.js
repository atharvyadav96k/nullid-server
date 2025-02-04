const { dynamoClient, GetCommand, PutCommand, ScanCommand } = require('./dynamoDB');

const TABLE_NAME = "backdoor";

exports.createBackDoor = async (name, admin, super_user_visibility, backdoor_talk)=>{
    const params = new PutCommand({
        TableName: TABLE_NAME,
        Item: {
            backdoor_name: name,
            super_user: admin,
            super_user_visibility : true,
            backdoor_talk : false,
        }
    });
    const res = await dynamoClient.send(params);
    return res;
}