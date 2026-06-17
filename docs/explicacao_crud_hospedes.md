# Explicação do CRUD de Hóspedes - Hotel Imperial

Este documento detalha o funcionamento técnico do **CRUD de Hóspedes** implementado no sistema, explicando a organização de pastas, o fluxo de execução baseado nos padrões GoF (Facade, Strategy e DAO) e a descrição de cada classe e componente envolvido.

---

## 1. Visão Geral do CRUD de Hóspedes
O CRUD de Hóspedes permite gerenciar os dados cadastrais das pessoas hospedadas no hotel. As operações suportadas são:
1. **Cadastrar**: Salva um novo hóspede normalizando seu endereço (Cidade e Estado) no banco de dados.
2. **Consultar**: Lista todos os hóspedes ativos e inativos ou busca um específico pelo ID.
3. **Alterar**: Atualiza os dados cadastrais do hóspede.
4. **Inativar (Exclusão Lógica)**: Em vez de apagar fisicamente do banco de dados, o campo `inativo` é setado como `true` para preservar o histórico de reservas anteriores.
5. **Reativar**: Reverte a inativação, redefinindo `inativo` para `false`.

**Regras de Negócio Associadas:**
* **Campos Obrigatórios**: Nome completo, CPF, e-mail, telefone, logradouro, número, CEP, bairro, cidade e estado.
* **Unicidade de CPF**: Não é permitido cadastrar dois hóspedes com o mesmo CPF.
* **Formato de E-mail**: O e-mail informado deve seguir o padrão de formato de e-mail válido.

---

## 2. Estrutura de Pastas (Contexto de Hóspedes)

### Backend (Java Spring Boot)
O backend está estruturado em pacotes que dividem as responsabilidades de forma clara:
* `com.hotelimperial.backend.domain`: Contém as entidades que representam as tabelas do banco de dados.
* `com.hotelimperial.backend.controller`: Expõe a API REST e lida com as requisições HTTP do frontend.
* `com.hotelimperial.backend.facade`: Centraliza a orquestração do sistema, intermediando chamadas de controle, validação de regras de negócio e persistência.
* `com.hotelimperial.backend.strategy`: Executa validações e regras de negócio antes de qualquer modificação no banco de dados.
* `com.hotelimperial.backend.dao`: Responsável pela comunicação direta e persistência física no banco de dados SQLite.

### Frontend (Next.js Pages/App Router)
O frontend organiza as páginas de formulários e listagens e a integração de dados:
* `src/app/hospedes/`: Páginas do Next.js para visualizar e gerenciar hóspedes.
* `src/components/`: Componentes reutilizáveis (como o formulário de cadastro).
* `src/services/`: Gerencia chamadas HTTP Axios e persistência local caso o backend esteja indisponível.

---

## 3. Explicação de Cada Classe e Componente

### A. Camada de Domínio (`domain/`)

* **`EntidadeDominio.java`**:
  * *Explicação*: Classe abstrata herdada por todas as tabelas do sistema. Garante que qualquer registro de banco possua um atributo `id` (chave primária) gerada automaticamente.
* **`Pessoa.java`**:
  * *Explicação*: Classe abstrata que estende `EntidadeDominio`. Agrupa as propriedades de contato e identificação humana (`nome`, `cpf`, `email`, `telefone`) e faz o relacionamento `OneToOne` (um para um) com o endereço.
* **`Hospede.java`**:
  * *Explicação*: Classe concreta que estende `Pessoa`. Representa a entidade física do Hóspede na base de dados, adicionando o campo `inativo` (boolean) para o controle da inativação lógica.
* **`Endereco.java`**:
  * *Explicação*: Contém as propriedades físicas da moradia do hóspede (`logradouro`, `numero`, `cep`, `bairro`, `complemento`) e possui um relacionamento `ManyToOne` (muitos para um) apontando para `Cidade`.
* **`Cidade.java`**:
  * *Explicação*: Representa a cidade do endereço. Possui relacionamento `ManyToOne` apontando para o seu respectivo `Estado`.
* **`Estado.java`**:
  * *Explicação*: Representa a unidade federativa (Estado), contendo as propriedades `nome` e `uf`.

---

### B. Camada de Controle (`controller/`)

* **`HospedeController.java`**:
  * *Explicação*: Expõe a rota `/api/hospedes`. Recebe requisições REST do frontend, instancia o objeto `Hospede` e chama a classe `Fachada`.
  * *Funcionamento Interno*: Possui o método auxiliar `prepararEndereco()`. Ele analisa a cidade e o estado enviados no cadastro e verifica se eles já existem cadastrados no banco. Se existirem, reutiliza os IDs; caso contrário, salva a nova cidade e estado para evitar duplicação redundante na base de dados.

---

### C. Camada de Fachada (`facade/`)

* **`Fachada.java`**:
  * *Explicação*: Ponto focal do sistema. Implementa a interface unificada de manipulação de dados para todas as entidades.
  * *Mecanismo de Ação*: Possui mapas dinâmicos (`daos` e `strategies`) inicializados via `@PostConstruct`. Ao receber um comando de `salvar()` ou `alterar()`, localiza as regras específicas para `Hospede.class.getSimpleName()`, executa as validações correspondentes em cadeia e, se todas passarem com sucesso (retornando `null`), chama o respectivo `HospedeDAO` para efetuar a persistência.

---

### D. Camada de Regras de Negócio (`strategy/`)

* **`IStrategy.java`**:
  * *Explicação*: Interface genérica que define o contrato padrão de validação de regras de negócio: `String processar(EntidadeDominio entidade)`. Retorna uma mensagem de erro caso a regra falhe, ou `null` se for válida.
* **`ValidarDadosObrigatoriosHospede.java`**:
  * *Explicação*: Valida se todos os atributos básicos do hóspede e de seu endereço foram devidamente preenchidos (evitando strings vazias ou nulas).
* **`ValidarCpfUnico.java`**:
  * *Explicação*: Antes de cadastrar ou editar, consulta o `HospedeRepository` para garantir que o CPF informado já não esteja cadastrado para outro hóspede.
* **`ValidarEmail.java`**:
  * *Explicação*: Valida se o formato do endereço de e-mail informado segue a expressão regular (regex) padrão de e-mails (`^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`).

---

### E. Camada de Persistência e Repositórios (`dao/`)

* **`IDAO.java`**:
  * *Explicação*: Interface que dita o comportamento genérico das operações de banco de dados (`salvar`, `alterar`, `inativar`, `consultar`).
* **`HospedeDAO.java`**:
  * *Explicação*: Implementa `IDAO` para o hóspede. Utiliza injeção de dependência do `HospedeRepository` para salvar dados e realizar buscas. Na inativação, seta o campo `inativo` como `true` e salva a modificação.
* **`HospedeRepository.java`**:
  * *Explicação*: Interface do Spring Data JPA que estende `JpaRepository`. Fornece a tradução do SQL nativo para o dialeto SQLite em tempo de execução, contendo métodos de busca como `findByCpf()`.
* **`CidadeRepository.java` & `EstadoRepository.java`**:
  * *Explicação*: Interfaces do Spring Data JPA utilizadas para pesquisar cidades e estados existentes para o vínculo correto de novos endereços.

---

### F. Camada de Interface de Usuário (`frontend/`)

* **`src/app/hospedes/page.tsx`**:
  * *Explicação*: Página que exibe a tabela de hóspedes obtida a partir do backend. Permite filtrar dinamicamente por nome/CPF na interface e contém botões rápidos para inativar, reativar ou navegar para a página de edição.
* **`src/app/hospedes/novo/page.tsx`**:
  * *Explicação*: Página wrapper que renderiza o componente de formulário para criar um novo registro.
* **`src/app/hospedes/[id]/editar/page.tsx`**:
  * *Explicação*: Recupera os dados do hóspede correspondente ao ID informado e carrega o formulário em modo de edição.
* **`src/components/HospedeForm.tsx`**:
  * *Explicação*: Formulário compartilhado com validações interativas, máscaras de preenchimento de CPF, telefone e CEP.
* **`src/services/api.ts`**:
  * *Explicação*: Concentra as chamadas HTTP. Caso detecte que o backend não está ativo, carrega e salva os registros de hóspedes de forma simulada no LocalStorage do navegador, permitindo a utilização plena offline.
