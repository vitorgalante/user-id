# Documentação do Código de Gerenciamento de Identidade do Usuário

Este código fornece uma implementação para gerenciar a identidade do usuário e persistir informações como `userId` e `anonymousId` usando diferentes mecanismos de armazenamento: **cookies**, **localStorage** e **memória temporária**.

## Como Funciona

### **Classes Principais**

#### 1. **`StorageManager`**
- **Descrição**: Gerencia múltiplos mecanismos de armazenamento de forma unificada.
- **Funções principais**:
  - `get(key)`: Retorna o valor associado à chave da primeira fonte onde o dado foi encontrado.
  - `set(key, value)`: Salva um valor em todos os mecanismos configurados.
  - `remove(key)`: Remove a chave de todos os mecanismos.

#### 2. **`CookieStorage`**
- **Descrição**: Implementa o armazenamento usando cookies.
- **Funções principais**:
  - `get(key)`: Obtém o valor de um cookie.
  - `set(key, value)`: Salva um valor como cookie.
  - `remove(key)`: Remove um cookie especificado.

#### 3. **`LocalStorage`**
- **Descrição**: Utiliza o `localStorage` para persistir os dados no navegador.
- **Funções principais**:
  - `get(key)`: Retorna o valor associado à chave no `localStorage`.
  - `set(key, value)`: Salva o valor no `localStorage`.
  - `remove(key)`: Remove uma chave do `localStorage`.

#### 4. **`MemoryStorage`**
- **Descrição**: Implementa um armazenamento temporário em memória.
- **Funções principais**:
  - `get(key)`: Retorna o valor armazenado na memória.
  - `set(key, value)`: Salva o valor na memória.
  - `remove(key)`: Remove o valor da memória.

#### 5. **`UserIdentityManager`**
- **Descrição**: Gerencia os identificadores do usuário (`userId` e `anonymousId`).
- **Funções principais**:
  - `getUserId()`: Retorna o `userId` armazenado.
  - `setUserId(userId)`: Salva o `userId`.
  - `getAnonymousId()`: Retorna ou gera um novo `anonymousId`.
  - `setAnonymousId(anonymousId)`: Salva o `anonymousId`.
  - `generateUUID()`: Gera um identificador único.

---

## Exemplo de Uso

```javascript
// Criando a instância do gerenciador de identidade
const userManager = new UserIdentityManager();

// Configurando um userId
userManager.setUserId('12345');
console.log('UserId:', userManager.getUserId()); // Output: '12345'

// Trabalhando com anonymousId
console.log('AnonymousId:', userManager.getAnonymousId()); // Gera ou retorna um anonymousId existente
```

---

## FAQ

### **1. Para que serve o `anonymousId`?**
O `anonymousId` é usado para rastrear usuários que ainda não foram identificados (ex.: visitantes do site que ainda não fizeram login).

### **2. O que acontece se o `userId` for redefinido?**
O `userId` será atualizado em todos os mecanismos de armazenamento configurados (cookies, localStorage, etc.), e o valor anterior será sobrescrito.

### **3. Qual a diferença entre `LocalStorage` e `CookieStorage`?**
- **LocalStorage**:
  - Armazena dados apenas no navegador atual.
  - Não é enviado automaticamente para o servidor em cada requisição.
- **CookieStorage**:
  - Armazena dados que podem ser compartilhados entre subdomínios.
  - Os cookies são enviados automaticamente ao servidor em cada requisição.

### **4. Como o código lida com a falta de suporte para `localStorage`?**
Se `localStorage` não estiver disponível, o código utiliza cookies ou memória como fallback.

### **5. É possível usar apenas memória para armazenar dados?**
Sim, basta configurar a instância de `StorageManager` apenas com o `MemoryStorage`.

---

## Melhorias Futuras
- Adicionar suporte para sessionStorage como outro mecanismo de armazenamento.
- Implementar criptografia opcional para dados sensíveis.
- Suporte para expiração automática dos dados armazenados.
