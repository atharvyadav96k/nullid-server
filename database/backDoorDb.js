const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { dynamoClient, GetCommand, PutCommand, ScanCommand, UpdateCommand, DeleteCommand } = require('./dynamoDB');

const TABLE_NAME = "backdoor";
// Give access to service only if user is super user
const isSuperUser = async (name, admin)=>{
    const getParams = new GetCommand({
        TableName: TABLE_NAME,
        Key: { backdoor_name: name },
    });

    const existingItem = await dynamoClient.send(getParams);
    if (!existingItem.Item) {
        throw new Error("Backdoor entry not found");
    }
    if (existingItem.Item.super_user !== admin) {
        throw new Error("Unauthorized: Only the super user can update this entry");
    }
}
exports.createBackDoor = async (name, admin, super_user_visibility, backdoor_talk)=>{
    const params = new PutCommand({
        TableName: TABLE_NAME,
        Item: {
            backdoor_name: name,
            super_user: admin,
            super_user_visibility : super_user_visibility,
            backdoor_talk : backdoor_talk,
        }
    });
    const res = await dynamoClient.send(params);
    return res;
}
exports.updateBackDoor = async (name, admin, super_user_visibility, backdoor_talk) => {
    await isSuperUser(name, admin);
    const params = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { backdoor_name: name },
        UpdateExpression: "SET super_user_visibility = :vis, backdoor_talk = :talk",
        ExpressionAttributeValues: {
            ":vis": super_user_visibility,
            ":talk": backdoor_talk
        },
        ReturnValues: "ALL_NEW"
    });
    const res = await dynamoClient.send(params);
    return res;
};
exports.terminateBackDoor  = async (name, admin) =>{
    await isSuperUser(name, admin);
    console.log(typeof(name))
    const params = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {backdoor_name: name}
    });
    const res = await dynamoClient.send(params);
    return res;
}

exports.getSuperUserBackDoors = async (admin) =>{
    const params = new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "super_user = :admin",
        ExpressionAttributeValues: {
            ":admin" : admin
        }
    });
    const res = dynamoClient.send(params);
    return res;
}