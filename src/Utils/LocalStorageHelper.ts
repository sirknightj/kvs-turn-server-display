class LocalStorageHelper {
    private static regionKey = 'region';
    private static accessKeyIdKey = 'accessKeyId';
    private static secretAccessKeyKey = 'secretAccessKey';
    private static sessionTokenKey = 'sessionToken';
    private static signalingChannelKey = 'signalingChannel';

    private constructor() {
    }

    static saveCredentialsToLocalStorage(accessKey: string, secretKey: string, sessionToken?: string) {
        localStorage.setItem(this.accessKeyIdKey, accessKey);
        localStorage.setItem(this.secretAccessKeyKey, secretKey);
        localStorage.setItem(this.sessionTokenKey, sessionToken ?? '');
    }

    static saveRegionToLocalStorage(region: string) {
        localStorage.setItem(this.regionKey, region);
    }

    static loadCredentialsFromLocalStorage() {
        return {
            credentials: {
                accessKeyId: localStorage.getItem(this.accessKeyIdKey) || '',
                secretAccessKey: localStorage.getItem(this.secretAccessKeyKey) || '',
                sessionToken: localStorage.getItem(this.sessionTokenKey) || ''
            }
        };
    }

    static loadRegionFromLocalStorage() {
        return {
            region: localStorage.getItem(this.regionKey) || 'us-west-2',
        };
    }

    static getClientConfigFromLocalStorage() {
        return {...this.loadCredentialsFromLocalStorage(), ...this.loadRegionFromLocalStorage()};
    }

    static saveSignalingChannelToLocalStorage(signalingChannel: string) {
        localStorage.setItem(this.signalingChannelKey, signalingChannel);
    }

    static loadSignalingChannelFromLocalStorage() {
        return localStorage.getItem(this.signalingChannelKey) || '';
    }
}

export default LocalStorageHelper;
