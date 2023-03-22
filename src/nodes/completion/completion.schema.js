const { Node, Schema, fields } = require("@mayahq/module-sdk");
const axios = require("../../util/axios");
const auth = require("../mayaKey/mayaKey.schema")

class Completion extends Node {
    constructor(node, RED, opts) {
        super(node, RED, {
            ...opts,
            masterKey:
                "eda344e1ab8b9e122aab3350eec33e95802c7fe68aac8ad85c5c64d97e45ef1a",
        });
    }

    static schema = new Schema({
        name: "completion",
        label: "Completion",
        category: "Mayahq Text To Text :: Language Service",
        isConfig: false,
        fields: {
            auth: new fields.ConfigNode({
                type: auth,
                displayName: "Auth"
            }),
            prompt: new fields.Typed({
                type: "str",
                allowedTypes: ["msg", "flow", "global", "str"],
                defaultVal: "abc",
                displayName: "prompt",
            }),
            model: new fields.Select({
                options: ["gpt-3.5-turbo"],
                defaultVal: "gpt-3.5-turbo",
                displayName: "model"
            }),
            temperature: new fields.Typed({
                type: 'num',
                defaultVal: 0.7,
                allowedTypes: ["num"],
                displayName: "temperature"
            }),
            maxToken: new fields.Typed({
                allowedTypes:["num"],
                type: "num",
                defaultVal: 400,
                displayName: "max tokens"
            })
        },
        color: "#37B954",
    });

    async onMessage(msg, vals) {
        this.setStatus("PROGRESS", "Processing...");

        const request = {
            url: `/api/completion`,
            method: "post",
            headers:{
                "X-API-KEY": this.credentials.auth.key
            },
            data: {
                prompt: vals.prompt,
            },
        };

        try {
            const response = await axios(request);
            msg.payload = {
                prompt: vals.prompt,
                ...response.data,
            };
            this.setStatus("SUCCESS", "Done");
        } catch (e) {
            this.setStatus("ERROR", "Error:" + e.toString());
            msg.__isError = true;
            msg.__error = e;
        }

        return msg;
    }
}

module.exports = Completion;
