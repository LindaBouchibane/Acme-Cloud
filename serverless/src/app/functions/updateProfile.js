const hubspot = require('@hubspot/api-client');

const ALLOWED_PROPERTIES = ['firstname', 'lastname', 'jobtitle', 'phone'];

exports.main = async (context, sendResponse) => {
  const body = context.body ?? {};

  if (!body.contactId) {
    sendResponse({
      statusCode: 400,
      body: { success: false, error: 'Paramètre contactId manquant.' },
    });
    return;
  }

  const { contactId } = body;

  const properties = {};
  for (const key of ALLOWED_PROPERTIES) {
    if (body[key] !== undefined) {
      properties[key] = String(body[key]).trim();
    }
  }

  if (Object.keys(properties).length === 0) {
    sendResponse({
      statusCode: 400,
      body: { success: false, error: 'Aucune propriété valide à mettre à jour.' },
    });
    return;
  }

  const client = new hubspot.Client({
    accessToken: process.env.HS_ACCESS_TOKEN,
  });

  try {
    const updated = await client.crm.contacts.basicApi.update(contactId, { properties });

    const contact = {};
    for (const key of ALLOWED_PROPERTIES) {
      contact[key] = updated.properties[key] ?? '';
    }

    sendResponse({
      statusCode: 200,
      body: { success: true, contact },
    });
  } catch (err) {
    if (err.code === 404 || err.statusCode === 404) {
      sendResponse({
        statusCode: 404,
        body: { success: false, error: 'Contact introuvable.' },
      });
      return;
    }

    console.error('[updateProfile] Unexpected error:', err.message);
    sendResponse({
      statusCode: 500,
      body: { success: false, error: 'Erreur interne. Veuillez réessayer.' },
    });
  }
};
