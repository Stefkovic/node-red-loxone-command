module.exports = function (RED) {
    function MiniserverNode(n) {
        RED.nodes.createNode(this, n);
        this.host = n.host;
    }
    RED.nodes.registerType("miniserver", MiniserverNode, {
        credentials: {
            user: { type: "text" },
            password: { type: "password" }
        }
    });
}