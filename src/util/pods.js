import data from "@solid/query-ldflex";
import auth from "solid-auth-client";
import { uniqueId } from './helper';

const appPath = "public/munnypouch/";

// Gets JSON object from ttl doc
export async function unmarshal(uri, shape) {
  const doc = await fetchDocument(uri);
  if (!doc) return { uri };
  const datum = { uri };
  await Promise.all(
    shape.shape.map(async ({ prefix, predicate, alias, parse }) => {
      const val = await doc[`${ shape["@context"][prefix] }${ predicate }`];
      if (val) {
        datum[alias || predicate] = parse ? parse(val.value) : val.value;
      }
    })
  );
  return datum;
}

// Login
export async function popupLogin() {
  let session = await auth.currentSession();
  let popupUri = 'https://solidcommunity.net/common/popup.html';
  if (!session)
    session = await auth.popupLogin({ popupUri });
}

// Login
export async function logout() {
  localStorage.removeItem("lastLogin")
  await auth.logout()
}

/**
 * Creates a valid string that represents the application path. This is the
 * default value if no storage predicate is discovered
 * @param webId
 * @param path
 * @returns {*}
 */
export const buildPathFromWebId = (webId, path) => {
  if (!webId) return false;
  const domain = new URL(webId).origin;
  return `${ domain }/${ path }`;
};

/**
 * Helper function to check for the user's pod storage value. If it doesn't exist, we assume root of the pod
 * @returns {Promise<string>}
 */
export const getAppStoragePath = async webId => {
  const podStoragePath = await data[webId].storage;
  let podStoragePathValue =
    podStoragePath && podStoragePath.value.trim().length > 0
      ? podStoragePath.value
      : "";

  // Make sure that the path ends in a / so it is recognized as a folder path
  if (podStoragePathValue && !podStoragePathValue.endsWith("/")) {
    podStoragePathValue = `${ podStoragePathValue }/`;
  }

  // If there is no storage value from the pod, use webId as the backup, and append the application path from env
  if (!podStoragePathValue || podStoragePathValue.trim().length === 0) {
    return buildPathFromWebId(webId, appPath);
  }

  return `${ podStoragePathValue }${ appPath }`;
};

// Loads data from folders
export async function load(folder, shape, ...cb) {
  const folderDoc = await fetchDocument(folder);
  if (!folderDoc) return false;
  const data = [];
  for await (const item of folderDoc["ldp:contains"]) {
    data.push(await unmarshal(item.value, shape));
  }
  cb.forEach(f => f(data));
  return true;
}

// Saves array JSON data to file
export async function save(shape, data, folder) {
  let error;
  return Promise.all(
    data.map(async datum => {
      datum.lastUpdated = new Date();
      if (!datum.uri) {
        datum.uri = `${ folder }${ uniqueId() }.ttl`
        try {
          await createNonExistentDocument(datum.uri);
        } catch (e) {
          return Promise.reject(e)
        }
      }
      const doc = await fetchDocument(datum.uri);
      shape.shape.forEach(async ({ prefix, predicate, alias, stringify }) => {
        const object = datum[alias || predicate];
        if (!object) return;
        try {
          await doc[`${ shape["@context"][prefix] }${ predicate }`].set(
            stringify ? stringify(object) : object
          );
        } catch (e) {
          error = e;
          console.log("ISSUE SAVING:", object)
        }
      });
      if (error) {
        console.log("Error saving:", error);
        return Promise.reject(error);
      }
    })
  );
}

// Saves JSON data to file
export async function saveOne(shape, datum) {
  datum.lastUpdated = new Date();
  let doc = await fetchDocument(datum.uri);
  if (!doc) {
    await createNonExistentDocument(datum.uri);
    doc = await fetchDocument(datum.uri);
  }
  return Promise.all(
    shape.shape.map(async ({ prefix, predicate, alias, stringify }) => {
      const object = datum[alias || predicate];
      await doc[`${ shape["@context"][prefix] }${ predicate }`].set(
        stringify ? stringify(object) : object
      );
    })
  )
}

// Delete file from storage
export const deleteFile = async url => {
  try {
    return await auth.fetch(url, { method: "DELETE" });
  } catch (e) {
    throw e;
  }
};

// Create new document
export const createNonExistentDocument = async (documentUri, body = "") => {
  try {
    const result = await documentExists(documentUri);

    return result.status === 404 ? createDocument(documentUri, body) : null;
  } catch (e) {
    throw e;
  }
};

// Loads document
export const fetchDocument = async documentUri => {
  try {
    const result = await documentExists(documentUri);
    if (result.status === 404) return null;
    const document = await data[documentUri];
    return document;
  } catch (e) {
    throw e;
  }
};

// Checks if storage exists
export const folderExists = async folderPath => {
  const result = await auth.fetch(folderPath);
  return result.status === 403 || result.status === 200;
};

// Creates storage path
export const getDataPath = async folderPath => {
  try {
    const existContainer = await folderExists(folderPath);
    const data = `${ folderPath }data.ttl`;
    if (existContainer) return folderPath;

    await createDoc(data, {
      method: "PUT",
      headers: {
        "Content-Type": "text/turtle"
      }
    });

    return folderPath;
  } catch (error) {
    throw new Error(error);
  }
};

// Internal helpers
export const documentExists = async documentUri =>
  auth.fetch(documentUri, {
    headers: {
      "Content-Type": "text/turtle"
    }
  });

const createDoc = async (documentUri, options) => {
  try {
    return await auth.fetch(documentUri, options);
  } catch (e) {
    throw e;
  }
};

export const createDocument = async (documentUri, body = "") => {
  try {
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "text/turtle"
      },
      body
    };
    return await createDoc(documentUri, options);
  } catch (e) {
    throw e;
  }
};
