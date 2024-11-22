module.exports = function (RED) {
    const axios = require('axios');

    function LoxoneCommandNode(config) {
        RED.nodes.createNode(this, config);

        const miniserver = RED.nodes.getNode(config.miniserver);
        const { vti: configVti, block: configBlock, blockinput: configBlockInput, value: configValue } = config;

        if (!miniserver) {
            this.error('Miniserver configuration is missing.');
            return;
        }

        const { host, credentials } = miniserver;
        const { user, password } = credentials;
        if (!user || !password) {
            this.error('Miniserver credentials are missing.');
            return;
        }

        const authConfig = {
            auth: {
                username: user,
                password: password,
            },
        };

        this.on('input', (msg, send, done) => {
            const vti = msg.vti || configVti;
            const block = msg.block || configBlock;
            const blockinput = msg.blockinput || configBlockInput;
            const value = msg.payload || configValue;
            const command = `SET(${block};${blockinput};${value})`;
            const url = `http://${host}/jdev/sps/io/${vti}/${command}`;

            axios
                .post(url, null, authConfig)
                .then((response) => {
                    this.log('Loxone response received successfully.');
                    if (send) {
                        send({ ...msg, payload: response.data.LL });
                    }
                    if (done) done();
                })
                .catch((error) => {
                    this.error(`Error in Loxone command: ${error.message}`, msg);
                    if (done) done(error);
                });
        });
    }

    RED.nodes.registerType('loxone-command', LoxoneCommandNode);
};