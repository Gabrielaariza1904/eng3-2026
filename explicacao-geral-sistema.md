# Explicação Geral do Sistema - Hotel Imperial (Módulo CRUD de Hóspedes)

Este documento foi criado para ajudar na apresentação do trabalho. Ele explica detalhadamente a estrutura de pastas do projeto, o objetivo de cada uma, o motivo de seus nomes, a função de cada classe e uma explicação passo a passo da lógica do código e de seus `imports`.

---

## 1. Visão Geral da Arquitetura do Projeto
O projeto está dividido sob uma arquitetura **Monorepo** simples contendo:
* **`hotel-imperial/`**: O diretório raiz da aplicação principal.
  * **`backend/`**: Aplicação servidora desenvolvida em Java com Spring Boot.
  * **`frontend/`**: Aplicação cliente desenvolvida em React/TypeScript com Next.js e Tailwind CSS.
* **`diagramas/`**: Contém as modelagens do sistema (Mermaid e PlantUML).
* **`prototipos/`**: Telas estáticas em HTML/CSS/JS usadas como referência visual inicial.

---

## 2. Estrutura de Pastas do Backend

Abaixo está o detalhamento de cada diretório do backend, de fora para dentro, explicando a nomenclatura e o propósito:

### 📁 `hotel-imperial/backend/`
* **Por que tem esse nome?**: Indica a parte traseira (servidor) da aplicação, que lida com o processamento de regras de negócio, conexão com o banco de dados e exposição da API REST.
* **Conteúdo**: Contém o arquivo `pom.xml` e a pasta `src/`.

### 📄 `pom.xml` (Project Object Model)
* **Objetivo**: Arquivo de configuração central do **Maven** (gerenciador de dependências e build do ecossistema Java).
* **O que faz**: Declara as dependências que o sistema precisa (Spring Boot Web, Data JPA, SQLite, etc.) e plugins de compilação (JaCoCo para cobertura de testes).

### 📁 `src/` (Source)
* **Por que tem esse nome?**: Abreviação de *Source Code* (Código Fonte). É a pasta padrão onde reside todo o código desenvolvido.
* **Divisão**: Contém duas pastas: `main/` (código de produção) e `test/` (código de testes automatizados).

### 📁 `src/main/`
* **Por que tem esse nome?**: Indica a ramificação "principal", ou seja, o código que realmente será compilado e distribuído em ambiente de produção.

### 📁 `src/main/resources/`
* **Por que tem esse nome?**: Pasta reservada para recursos não-código que o sistema precisa ler (como arquivos de propriedades, SQLs estáticos ou templates).
  * **`application.properties`**: Arquivo de configurações do Spring. Define a porta do servidor (`8080`), a conexão JDBC para o banco SQLite local (`jdbc:sqlite:hotelimperial.db`), e o comportamento do Hibernate (`spring.jpa.hibernate.ddl-auto=update` para criar/atualizar as tabelas automaticamente).

### 📁 `src/main/java/`
* **Por que tem esse nome?**: Indica que todo o código-fonte contido nela é escrito na linguagem de programação Java.

### 📁 `src/main/java/com/hotelimperial/backend/`
* **Por que tem esse nome?**: Segue o padrão de nomenclatura de pacotes do Java (Java Package Naming Conventions), que usa o nome de domínio reverso (`com.hotelimperial.backend`) para garantir que o namespace do projeto seja único globalmente.
* **Classes na raiz do pacote**:
  * **`BackendApplication.java`**: A classe de entrada (entrypoint) que inicializa o Spring Boot através do método `main`. Ela carrega todo o ecossistema do servidor.

---

## 3. Os Pacotes Internos do Backend e suas Classes

Para atender o padrão GoF (Fachada, DAO e Strategy) solicitado na modelagem do sistema, dividimos as classes nos seguintes subpacotes:

### 📁 `domain/` (Domínio)
* **Objetivo**: Contém as classes que representam os conceitos e regras estruturais de negócio do hotel. São mapeadas como entidades do banco de dados (tabelas) via JPA (Java Persistence API).
* **O que cada arquivo faz**:
  * **`EntidadeDominio.java`**: Superclasse abstrata com atributo `id`. Garante que todas as entidades do sistema herdem uma chave primária padrão.
  * **`Pessoa.java`**: Superclasse abstrata mapeada via `@MappedSuperclass`. Reúne os dados genéricos compartilhados por pessoas (`nome`, `cpf`, `email`, `telefone`) e o relacionamento `@OneToOne` com `Endereco`.
  * **`Hospede.java`**: Estende `Pessoa`. Representa a tabela física de hóspedes, incluindo o atributo boolean `inativo` para gerenciar a inativação lógica de registros.
  * **`Endereco.java`**: Representa os dados do logradouro (`rua`, `numero`, `cep`, `bairro`, `complemento`) e associa-se a uma `Cidade`.
  * **`Cidade.java`**: Representa a cidade, contendo o relacionamento com o `Estado`.
  * **`Estado.java`**: Representa o estado (UF) associado ao endereço.

---

### 📁 `controller/` (Controladores HTTP)
* **Objetivo**: Camada responsável por escutar chamadas HTTP do frontend (como um formulário enviado), ler os parâmetros e disparar o fluxo de processamento.
* **Classes contidas**:
  * **`HospedeController.java`**:

#### Exposição Detalhada do Código de `HospedeController.java`:

##### **Imports no topo da classe**:
```java
// Indica a localização física da classe no pacote
package com.hotelimperial.backend.controller;

// Repositórios injetados para manipular Cidades e Estados no endereço
import com.hotelimperial.backend.dao.CidadeRepository;
import com.hotelimperial.backend.dao.EstadoRepository;
// Importa as classes do domínio (Hospede, Cidade, etc.)
import com.hotelimperial.backend.domain.*;
// Fachada central que orquestra as validações
import com.hotelimperial.backend.facade.Fachada;
// Anotações e utilitários do framework Spring Boot
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
```

##### **Anotações da Classe**:
* **`@RestController`**: Informa ao Spring que esta classe é um controlador de API REST. Retorna as respostas diretamente no formato JSON.
* **`@RequestMapping("/api/hospedes")`**: Define o prefixo da rota HTTP para acessar os métodos desta classe.

##### **Métodos**:
1. **`obterTodos()`** (`@GetMapping`):
   * *O que faz*: Executa uma requisição `GET` para listar todos os hóspedes. Ele delega a consulta para a `Fachada.consultar()` passando um objeto de filtro vazio.
2. **`obterPorId()`** (`@GetMapping("/{id}")`):
   * *O que faz*: Busca um hóspede específico. Instancia um objeto `Hospede` temporário, atribui o `id` recebido na URL (`@PathVariable`) e consulta a Fachada. Retorna `404 Not Found` se não encontrar ou `200 OK` com o hóspede encontrado.
3. **`criar()`** (`@PostMapping`):
   * *O que faz*: Cadastra um novo hóspede. Recebe os dados em formato JSON no corpo da requisição (`@RequestBody`). Executa o método `prepararEndereco()`, define `inativo = false` e chama `fachada.salvar()`. Se o retorno da fachada for `"Sucesso"`, retorna HTTP `201 Created`; senhas as validações falharem, retorna `400 Bad Request` com o erro ocorrido.
4. **`atualizar()`** (`@PutMapping("/{id}")`):
   * *O que faz*: Altera dados de um hóspede existente. Associa o `id` da URL ao hóspede, normaliza o endereço e envia para `fachada.alterar()`.
5. **`inativar()`** (`@DeleteMapping("/{id}")`):
   * *O que faz*: Executa a exclusão lógica do hóspede. Consulta o hóspede atual pelo ID e delega para `fachada.inativar(hospede)`.
6. **`reativar()`** (`@PatchMapping("/{id}/reativar")`):
   * *O que faz*: Ativa novamente um hóspede inativado. Busca o registro, redefine `inativo = false` e salva através da Fachada.
7. **`prepararEndereco()`** (Método Privado):
   * *Por que existe*: O endereço possui entidades normalizadas (`Cidade` e `Estado`). Se simplesmente tentássemos salvar, o banco criaria estados duplicados (ex: múltiplos registros "SP"). Este método verifica no banco de dados se a UF (Estado) e a Cidade fornecidas já existem. Se já existirem, reaproveita o registro existente. Se não existirem, grava o novo e o associa ao endereço do hóspede.

---

### 📁 `facade/` (Fachada GoF)
* **Objetivo**: Centraliza a orquestração do sistema. O controlador chama apenas a Fachada, isolando o fluxo de dados das particularidades do HTTP.
* **Classes contidas**:
  * **`Fachada.java`**:
    * *Como funciona*: Implementa um mapa de DAOs (`Map<String, IDAO>`) e de estratégias (`Map<String, List<IStrategy>>`). 
    * *Método `executarStrategies()`*: Varre todas as validações configuradas para a classe (para Hóspedes: obrigatoriedade, e-mail e CPF único) rodando uma a uma. Se qualquer uma retornar uma mensagem de erro, interrompe o salvamento e retorna a string com o erro.
    * *Métodos de ação (`salvar()`, `alterar()`, etc.)*: Executam as validações e, caso válidas, determinam a classe do objeto e despacham a operação para o DAO correto.

---

### 📁 `strategy/` (Estratégias de Regras de Negócio)
* **Objetivo**: Isola as regras e validações do sistema em classes focadas de propósito único, facilitando a manutenção e testes individuais.
* **Classes contidas**:
  * **`IStrategy.java`**: Interface genérica que define a assinatura padrão de processamento de regras de negócio.
  * **`ValidarDadosObrigatoriosHospede.java`**: Valida que campos como nome, CPF, e-mail, telefone, CEP e rua estejam preenchidos no objeto recebido, evitando gravação de lixo no banco.
  * **`ValidarCpfUnico.java`**: Injeta `HospedeRepository` e pesquisa no banco se já existe alguém com o mesmo CPF. Se encontrar outro id, bloqueia o cadastro de duplicatas.
  * **`ValidarEmail.java`**: Valida a sintaxe do e-mail digitado no formulário via expressão regular (regex).

---

### 📁 `dao/` (Data Access Object / Persistência)
* **Objetivo**: Abstrai os mecanismos de persistência lógica dos dados.
* **Classes contidas**:
  * **`IDAO.java`**: Interface comum para operações CRUD no banco.
  * **`HospedeDAO.java`**: Contém a lógica de persistência para hóspedes. Em operações como `salvar` ou `alterar`, ela delega o trabalho ao repositório JPA. No método `inativar`, define o hóspede como `inativo = true` e salva.
  * **`HospedeRepository.java`**: Estende `JpaRepository` do Spring Data. Trata-se de uma interface mágica na qual o Spring Data gera a implementação SQL correspondente automaticamente em tempo de execução.
  * **`CidadeRepository.java` & `EstadoRepository.java`**: Interfaces Spring Data JPA para consultar cidades e estados persistidos.

---

### 📁 `seeder/` (Semeador de Dados)
* **Objetivo**: Alimentar o banco de dados com massa de dados inicial na inicialização do servidor.
* **Classes contidas**:
  * **`DatabaseSeeder.java`**: Implementa `CommandLineRunner`. Sempre que o sistema inicia, ele verifica se existem hóspedes cadastrados no SQLite. Se a tabela estiver vazia, cria e salva 5 hóspedes iniciais com endereços associados nas cidades de São Paulo, Rio de Janeiro, Belo Horizonte, Campinas e Curitiba.

---

## 4. Estrutura de Pastas do Frontend

Abaixo está o detalhamento dos componentes do frontend (desenvolvido com Next.js 14):

### 📁 `hotel-imperial/frontend/src/` (Código Fonte)
Tudo o que é desenvolvido para a visualização da tela do usuário.

### 📁 `src/app/` (Roteamento baseado em pastas do Next.js)
No Next.js 14 (App Router), cada subpasta que contém um arquivo `page.tsx` cria uma rota web correspondente.
* **`layout.tsx`**: Contém o layout mestre que envolve toda a aplicação, incluindo a importação da fonte "Inter", e renderiza componentes globais como a `Sidebar` (menu lateral) e o `Header` (cabeçalho).
* **`globals.css`**: Define os estilos css globais e as diretivas do **Tailwind CSS** para estilização utilitária rápida.
* **`page.tsx`**: A raiz da rota inicial (`/`). Ela chama `redirect('/hospedes')` para redirecionar o usuário imediatamente para a tela de gerenciamento de hóspedes.
* **`hospedes/`**:
  * **`page.tsx`**: Tela de listagem. Faz a requisição `GET` para o backend para obter os hóspedes, monta a tabela de exibição e filtra na própria tabela por nome/CPF usando input dinâmico. Possui ações visuais de Inativar/Reativar e botões de editar.
  * **`novo/page.tsx`**: Renderiza o formulário `HospedeForm` limpo para criação.
  * **`[id]/editar/page.tsx`**: Usa roteamento dinâmico do Next.js para extrair o `id` da URL, busca os dados desse hóspede no backend e renderiza o `HospedeForm` preenchido.

### 📁 `src/components/` (Componentes Compartilhados)
* **`Header.tsx`**: Barra superior do painel que exibe a identificação do Hotel e informações do usuário logado.
* **`Sidebar.tsx`**: Menu lateral esquerdo de navegação. Contém o link para a tela de "Hóspedes" e um botão útil para "Reiniciar Banco de Dados", que limpa o LocalStorage de fallback local se acionado.
* **`Toast.tsx`**: Componente de alertas flutuantes no topo da tela para dar feedback ao usuário sobre operações salvas, editadas ou com erros.
* **`HospedeForm.tsx`**: O formulário do hóspede. 
  * *O que faz*: Gerencia o estado de digitação de cada campo. Aplica máscaras visuais reativas para CPF (`999.999.999-99`), Telefone (`(99) 99999-9999`) e CEP (`99999-999`). 
  * *Autocomplete de CEP*: Quando o CEP digitado atinge 8 dígitos válidos, faz uma chamada automática à API pública do **ViaCEP** (`https://viacep.com.br/ws/{cep}/json/`) para preencher instantaneamente a rua, bairro, cidade e estado do formulário, gerando uma experiência de alto nível para o usuário.

### 📁 `src/services/` (Integração de Dados)
* **`api.ts`**: Lógica de conexão. 
  * *O que faz*: Configura o **Axios** para se conectar na rota padrão do backend `http://localhost:8080/api`.
  * *Fallback Resiliente*: Se o servidor backend estiver desligado por qualquer motivo, o frontend detecta a falha e redireciona os comandos CRUD para ler/escrever diretamente no **LocalStorage** do navegador. Isso garante que a aplicação continue 100% interativa, funcionando perfeitamente em modo de demonstração stand-alone mesmo sem o backend rodando.
