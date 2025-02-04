exports.address = async (ip) => {
    if (ip.startsWith('::ffff:')) {
        ip = ip.substring(7);
    }

    if (ip === '127.0.0.1') {
        return res.send({
            message: 'You are accessing the server from localhost. No geolocation data is available.'
        });
    }
    const response = await fetch(`https://ipinfo.io/${ip}?token=c30788efb45483`);
    const jsonResponse = await response.json();
    if (jsonResponse.error) {
        return res.send({
            message: 'No data for this IP address',
        });
    }
    console.log(jsonResponse);
    return `IP: ${jsonResponse.ip}, City: ${jsonResponse.city} , Region : ${jsonResponse.region}, Country : ${jsonResponse.country}, Location : ${jsonResponse.loc}`;
}