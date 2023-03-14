import axios from "axios";
import * as https from "https";
import { apiKey, apiSecret } from "../localconfig";
export type GetCodeExplain = {
    explain: Array<string>;
};
export function getCodeExplain(
    prompt: string,
    lang: string,
    locale: string
): Promise<GetCodeExplain> {
    const API_URL = `https://wudao.aminer.cn/os/api/api/v2/multilingual_code/explain`;

    return new Promise((resolve, reject) => {
        let payload = {};
        payload = {
            apikey: apiKey,
            apisecret: apiSecret,
            lang,
            locale,
            n: 1,
            prompt: prompt,
        };
        const agent = new https.Agent({
            rejectUnauthorized: false,
        });

        axios
            .post(API_URL, payload, { proxy: false, timeout: 120000 })
            .then((res) => {
                if (res?.data.status === 0) {
                    let codeArray = res?.data.result.output.code;
                    const explain = Array<string>();
                    for (let i = 0; i < codeArray.length; i++) {
                        const explainStr = codeArray[i]; //.trimStart()
                        let tmpstr = explainStr;
                        if (tmpstr.trim() === "") continue;

                        explain.push(explainStr);
                    }
                    resolve({ explain });
                } else {
                    console.log(res);
                    reject("failed");
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}
