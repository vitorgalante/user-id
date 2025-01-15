// Versão do Código: 2025-01-14-001

// Gerenciador genérico de armazenamento
class StorageManager {
    constructor(storages) {
        this.storages = storages; // Lista de mecanismos de armazenamento fornecidos
    }

    // Recupera o valor associado a uma chave da primeira fonte disponível
    get(key) {
        for (const storage of this.storages) {
            try {
                const value = storage.get(key);
                if (value !== null) return value; // Retorna o valor encontrado
            } catch (err) {
                console.warn(`Erro ao obter a chave "${key}" do armazenamento`, err);
            }
        }
        return null; // Retorna null se nenhum mecanismo contiver o dado
    }

    // Salva o valor associado a uma chave em todos os mecanismos configurados
    set(key, value) {
        this.storages.forEach(storage => {
            let success = false;
            try {
                storage.set(key, value);
                success = true;
            } catch (err) {
                console.warn(`Erro ao salvar a chave "${key}" no armazenamento`, err);
            }

            // Retry logic for failed storage mechanisms
            if (!success) {
                try {
                    setTimeout(() => storage.set(key, value), 100); // Retry after 100ms
                } catch (retryErr) {
                    console.warn(`Falha ao tentar novamente salvar a chave "${key}" no armazenamento`, retryErr);
                }
            }
        });
    }

    // Remove a chave de todos os mecanismos configurados
    remove(key) {
        this.storages.forEach(storage => {
            try {
                storage.remove(key);
            } catch (err) {
                console.warn(`Erro ao remover a chave "${key}" do armazenamento`, err);
            }
        });
    }
}

// Armazenamento em cookies
class CookieStorage {
    get(key) {
        const value = document.cookie.split('; ').find(row => row.startsWith(`${key}=`));
        return value ? JSON.parse(decodeURIComponent(value.split('=')[1])) : null;
    }

    set(key, value) {
        document.cookie = `${key}=${encodeURIComponent(JSON.stringify(value))}; path=/;`;
    }

    remove(key) {
        document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    }
}

// Armazenamento em localStorage
class LocalStorage {
    get(key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }

    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    remove(key) {
        localStorage.removeItem(key);
    }
}

// Armazenamento em memória temporária
class MemoryStorage {
    constructor() {
        this.cache = {}; // Objeto para armazenar os dados
    }

    get(key) {
        return this.cache[key] || null; // Retorna o valor do cache
    }

    set(key, value) {
        this.cache[key] = value; // Armazena o valor no cache
    }

    remove(key) {
        delete this.cache[key]; // Remove o valor do cache
    }
}

// Gerenciamento de identidade do usuário
class UserIdentityManager {
    constructor() {
        // Inicializa o StorageManager com diferentes mecanismos de armazenamento
        this.storageManager = new StorageManager([
            new LocalStorage(),
            new CookieStorage(),
            new MemoryStorage()
        ]);

        this.userIdKey = 'user_id'; // Chave para armazenar o userId
        this.anonymousIdKey = 'anonymous_id'; // Chave para armazenar o anonymousId
    }

    // Obtém ou define o userId
    getUserId() {
        return this.storageManager.get(this.userIdKey);
    }

    setUserId(userId) {
        this.storageManager.set(this.userIdKey, userId);
    }

    // Obtém ou gera um anonymousId
    getAnonymousId() {
        let anonId = this.storageManager.get(this.anonymousIdKey);
        if (!anonId) {
            anonId = this.generateUUID(); // Gera um novo ID se não existir
            this.storageManager.set(this.anonymousIdKey, anonId);
        }
        return anonId;
    }

    setAnonymousId(anonymousId) {
        this.storageManager.set(this.anonymousIdKey, anonymousId);
    }

    // Gera um identificador único (UUID)
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = (Math.random() * 16) | 0;
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
    }
}

// Exemplo de uso:
const userManager = new UserIdentityManager();

// Configurando um userId
userManager.setUserId('12345');
console.log('UserId:', userManager.getUserId()); // Output: '12345'

// Trabalhando com anonymousId
console.log('AnonymousId:', userManager.getAnonymousId()); // Gera ou retorna um anonymousId existente
