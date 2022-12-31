import {createClient, Client} from "oicq";

export let client: Client;

export function initializeClient(qq: number, password: string, requireNoCheck: boolean): Promise<void> {
    client = createClient(qq, {platform: 1});

    client.on("system.login.slider", function ({url}) {
        if (requireNoCheck) {
            throw new Error("Please init the client before startup")
        }

        console.info("Please open the following URL in your browser and solve the slider captcha:");
        console.info(url);
        console.info("Then enter ticket and press Enter to continue.");

        process.stdin.once("data", (ticket: Buffer) => {
            const parsedTicket = ticket.toString().trim();
            this.submitSlider(parsedTicket);
        })

    });

    client.on("system.login.device", function ({phone}) {
        if (requireNoCheck) {
            throw new Error("Please init the client before startup")
        }

        this.sendSmsCode();
        console.info(`Please enter the code you received on your phone ${phone} and press Enter to continue.`);
        process.stdin.once("data", (code: Buffer) => {
            const parsedCode = code.toString().trim();
            this.submitSmsCode(parsedCode);
        });
    });

    return client.login(password);
}
