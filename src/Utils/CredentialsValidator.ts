import {GetCallerIdentityCommand, STSClient} from "@aws-sdk/client-sts";
import LocalStorageHelper from "./LocalStorageHelper";

class CredentialsValidator {
    static async areCredentialsValid(): Promise<boolean> {
        const creds = LocalStorageHelper.loadCredentialsFromLocalStorage().credentials;
        if (!creds.accessKeyId?.length || !creds.secretAccessKey) {
            return false;
        }

        const stsClient = new STSClient({
            ...LocalStorageHelper.getClientConfigFromLocalStorage()
        });
        const command = new GetCallerIdentityCommand({});

        try {
            const result = await stsClient.send(command);
            return Boolean(result.Arn);
        } catch (e) {
            return false;
        }
    }

}


export default CredentialsValidator;
