import {
  Account,
  Avatars,
  Client,
  Databases,
  Functions,
  ID,
  Permission,
  Query,
  Role,
  Storage,
  Teams,
} from "appwrite";
import React, { createContext, useContext, useState } from "react";
import {
  PROJECT_ENDPOINT,
  PROJECT_ID,
  SERVICOS_COLLECTION_ID,
} from "../libs/default";
const client = new Client();
client.setEndpoint(PROJECT_ENDPOINT).setProject(PROJECT_ID);
const ServerContext = createContext(null);
const avatars = new Avatars(client);
const account = new Account(client);
const teams = new Teams(client);
const storage = new Storage(client);
const databases = new Databases(client);
const Permissions = Permission;
const Roles = Role;
const id = ID;
const functions = new Functions(client);
const ServerProvider = ({ children }) => {
  const [update, setUpdate] = useState(null);
  const loginUsingCredentials = async (email, password) => {
    const promise = account.createEmailSession(email, password);

    promise.then(
      function (response) {
        console.log(response); // Success
      },
      function (error) {
        console.log(error); // Failure
      }
    );
  };
  const getAccount = async () => {
    return await account.get();
  };
  const logout = () => {
    const promise = account.deleteSessions();

    promise.then(
      function (response) {
        console.warn(response); // Success
      },
      function (error) {
        console.error(error); // Failure
      }
    );
  };
  const updateEmail = async (email, password) => {
    return await account.updateEmail(email, password);
  };
  const updateUserPrefs = async (prefs) => {
    const existingPrefs = await account.getPrefs();
    return account.updatePrefs({ ...existingPrefs, ...prefs });
  };
  const getServicoList = async (filters, limit, offset) => {
    return databases.listDocuments(SERVICOS_COLLECTION_ID, filters);
  };
  const createServico = async (data, user_id) => {
    const servico = await databases.createDocument(
      "freteme",
      "servicos",
      id.unique(),
      data,
      [Permission.write(Role.user(user_id))]
    );
    return servico;
  };
  const ceateFunction = async () => {
    const promise = functions.createExecution("socket");
    return promise;
  };
  const updateMessage = async (id, data, callback) => {
    try {
      const updatedDocument = await databases.updateDocument(
        "freteme",
        "chat",
        id,
        {
          message: data,
        }
      );

      callback(null, updatedDocument);
    } catch (error) {
      callback(error, null);
      console.error("Erro ao atualizar o documento:", error);
    }
  };
  const createMessage = async (chat_id) => {
    const id = chat_id;
    const driver = "Bruno Matheus";
    if (!id || !driver) return;

    try {
      const response = await databases.createDocument(
        "freteme",
        "chat",
        id,
        {
          order_id: id,
          driver: driver,
          user: "",
          message: [
            `{
              owner: ${driver}
              value:
                Olá, eu serei seu motorista nesse serviço! É proibido enviar mensagens com dados pessoais tais como: Senhas, telefone, email e documentos pessoais sensíveis, toda a comunicação é feita através do app! Caso isso ocorra, o chat será encerrado e o serviço cancelado.,
              created_at: ${Date.now()},
              status: false,
            }`,
          ],
        },
        [Permission.write(Roles.any()), Permission.read(Roles.any())]
      );

      if (typeof callback === "function") {
        console.warn(response);
        callback(null, response);
      }
    } catch (error) {
      console.error(error);
      if (typeof callback === "function") {
        callback(error);
      }
    }
  };
  const deleteMessage = (id, callback) => {
    const promise = databases.deleteDocument("freteme", "chat", "1");

    promise.then(
      function (response) {
        console.warn(response); // Success
      },
      function (error) {
        console.error(error); // Failure
      }
    );
  };
  const getMessages = (id, callback) => {
    const promise = databases.getDocument(
      "freteme",
      "chat",
      "644616199d934bd9af8a"
    );

    promise.then(
      function (response) {
        callback(null, response); // Success
      },
      function (error) {
        callback(error); // Failure
      }
    );
  };
  const getServices = (callback) => {
    databases
      .listDocuments("freteme", "servicos", [Query.equal("status", "pendente")])
      .then((response) => {
        callback(null, response.documents);
      })
      .catch((error) => {
        callback(error);
      });
  };
  const getMyService = (id, callback) => {
    databases
      .listDocuments("freteme", "servicos", [
        Query.equal("user_id", id),
        Query.notEqual("status", "finalizado"),
      ])
      .then((response) => {
        callback(null, response.documents);
      })
      .catch((error) => {
        callback(error);
      });
  };
  const getHistory = (id, callback) => {
    databases
      .listDocuments("freteme", "servicos", [Query.equal("driver_id", id)])
      .then((response) => {
        callback(null, response.documents);
      })
      .catch((error) => {
        callback(error);
      });
  };
  const getNotification = (id, callback) => {
    databases
      .listDocuments("freteme", "notification", [
        Query.equal("user_id", `${id}`),
        Query.limit(10),
      ])
      .then((response) => {
        callback(null, response.documents);
      })
      .catch((error) => {
        callback(error);
      });
  };
  const acceptService = async (id, data, callback) => {
    if (!id || !data) return;
    const response = databases.updateDocument("freteme", "servicos", id, {
      status: "aceito",
      driver: [JSON.stringify(data?.driver)],
      driver_id: data?.driver.id,
      veiculo: data?.veiculo,
    });

    response.then(
      function (response) {
        callback(null, response);
        console.warn(response);
        setUpdate(true);
      },
      function (error) {
        callback(error);
        console.error(error);
      }
    );
  };
  const updateService = async (id, status, callback) => {
    const response = databases.updateDocument("freteme", "servicos", id, {
      status: [status],
    });

    response.then(
      function (response) {
        callback(null, response);
      },
      function (error) {
        console.error(error);
        callback(error);
      }
    );
  };
  const deleteServico = async (jobId) => {
    await databases.deleteDocument(SERVICOS_COLLECTION_ID, jobId);
  };
  const getConfig = async (callback) => {
    const promise = databases.listDocuments("freteme", "config");

    promise.then(
      function (response) {
        callback(null, response);
      },
      function (error) {
        callback(error);
      }
    );
  };
  const getAvatar = () => {
    const response = avatars.getInitials();
    return response;
  };
  const getMedia = (id) => {
    const promise = databases.getDocument("freteme", "media", id);
    promise.then(
      function (response) {
        console.warn(response); // Success
      },
      function (error) {
        console.error(error); // Failure
      }
    );
    return promise;
  };
  const updateAccount = async (data) => {
    if (data) {
      if (data.name) {
        account.updateName(data.name);
      }
      if (data.phone) {
        account.updatePhone(data.phone, data.password);
      }
      if (data.password) {
        account.updatePassword(data.password);
      }
    }
  };
  const updatePassword = async (password, oldPassword) => {
    const promise = account.updatePassword(password, oldPassword);

    promise.then(
      function (response) {
        console.warn(response); // Success
      },
      function (error) {
        console.error(error); // Failure
      }
    );
  };
  const updatePhone = async (phone, password) => {
    const promise = account.updatePhone("+55" + phone, password);

    promise.then(
      function (response) {},
      function (error) {
        console.error(error); // Failure
      }
    );
  };
  const updateName = async (name) => {
    const promise = account.updateName(name);

    promise.then(
      function (response) {
        console.warn(response); // Success
      },
      function (error) {
        console.error(error); // Failure
      }
    );
  };
  async function handleToken(user_id, role, token) {
    const data = {
      user_id: user_id,
      role: role,
      token: token,
    };
    try {
      const response = await databases.createDocument(
        "freteme",
        "token",
        user_id,
        data,

        [Permission.write(Role.user(user_id))]
      );
      return response;
    } catch (error) {}
  }
  const updatePreferences = async (data) => {
    const response = account.updatePrefs({
      documents: data.documents,
      role: data.role,
      veiculo: data.veiculo,
    });

    response.then(
      function (response) {
        console.log(response);
      },
      function (error) {
        console.log(error);
      }
    );
    return response;
  };
  return (
    <ServerContext.Provider
      value={{
        update,
        updateAccount,
        loginUsingCredentials,
        getAccount,
        logout,
        updateEmail,
        updateUserPrefs,
        getMessages,
        getServicoList,
        createServico,
        updateService,
        deleteServico,
        getConfig,
        getMyService,
        ceateFunction,
        updateName,
        handleToken,
        updatePreferences,
        getNotification,
        getHistory,
        createMessage,
        updateMessage,
        getServices,
        acceptService,
        updatePhone,
        updatePassword,
        getMedia,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};
export const useServer = () => useContext(ServerContext);
export default ServerProvider;
