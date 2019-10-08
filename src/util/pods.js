import data from '@solid/query-ldflex';
import auth from 'solid-auth-client';

const appPath = 'public/munnypouch/';

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
    podStoragePath && podStoragePath.value.trim().length > 0 ? podStoragePath.value : '';

  // Make sure that the path ends in a / so it is recognized as a folder path
  if (podStoragePathValue && !podStoragePathValue.endsWith('/')) {
    podStoragePathValue = `${ podStoragePathValue }/`;
  }

  // If there is no storage value from the pod, use webId as the backup, and append the application path from env
  if (!podStoragePathValue || podStoragePathValue.trim().length === 0) {
    return buildPathFromWebId(webId, appPath);
  }

  return `${ podStoragePathValue }${ appPath }`;
};

// Internal helpers
export const documentExists = async documentUri =>
  auth.fetch(documentUri, {
    headers: {
      'Content-Type': 'text/turtle'
    }
  });

const createDoc = async (documentUri, options) => {
  try {
    return await auth.fetch(documentUri, options);
  } catch (e) {
    throw e;
  }
};

export const createDocument = async (documentUri, body = '') => {
  try {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/turtle'
      },
      body
    };
    return await createDoc(documentUri, options);
  } catch (e) {
    throw e;
  }
};

// Delete file from storage
export const deleteFile = async url => {
  try {
    return await auth.fetch(url, { method: 'DELETE' });
  } catch (e) {
    throw e;
  }
};

// Create new document
export const createNonExistentDocument = async (documentUri, body = '') => {
  try {
    const result = await documentExists(documentUri);

    return result.status === 404 ? createDocument(documentUri, body) : null;
  } catch (e) {
    throw e;
  }
};

// Loads document
export const fetchLdflexDocument = async documentUri => {
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
export const createContainer = async folderPath => {
  try {
    const existContainer = await folderExists(folderPath);
    const data = `${ folderPath }data.json`;
    if (existContainer) return folderPath;

    await createDoc(data, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return folderPath;
  } catch (error) {
    throw new Error(error);
  }
};
