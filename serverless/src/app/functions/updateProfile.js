const hubspot = require('@hubspot/api-client');

const ALLOWED_PROPERTIES = ['firstname', 'lastname', 'jobtitle', 'phone'];

exports.main = async (context) => {
  const body = context.body ?? {};

  if (!body.contactId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: 'Paramètre contactId manquant.' }),
    };
  }

  const { contactId } = body;

  const properties = {};
  for (const key of ALLOWED_PROPERTIES) {
    if (body[key] !== undefined) {
      properties[key] = String(body[key]).trim();
    }
  }

  if (Object.keys(properties).length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: 'Aucune propriété valide à mettre à jour.' }),
    };
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

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, contact }),
    };
  } catch (err) {
    if (err.code === 404 || err.statusCode === 404) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, error: 'Contact introuvable.' }),
      };
    }

    console.error('[updateProfile] Unexpected error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Erreur interne. Veuillez réessayer.' }),
    };
  }
};
