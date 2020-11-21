import { hash, compare } from 'bcrypt';

class EncryptUtil {
    private salt = 10
    hash(data: string) {
        return hash(data, this.salt)
    }
    compare(plainData, hashedData) {
        return compare(plainData, hashedData)
    }
}
export default new EncryptUtil;