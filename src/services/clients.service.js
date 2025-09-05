import { getDb } from "../lib/mongodb.js";
import { COLLECTIONS } from "../lib/collection-constants";

const updateOrganization = async (payload, id) => {
  try {
    const db = await getDb();
    const result = await db.collection(COLLECTIONS.ORGANIZATION).updateOne(
      { id },
      { $set: { ...payload } }
    );
    
    if (result.matchedCount === 0) {
      console.log("Organization not found");
      return [];
    }
    
    const updatedOrg = await db.collection(COLLECTIONS.ORGANIZATION).findOne({ id });
    return updatedOrg ? [updatedOrg] : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getClientById = async (
  id,
  email = null,
  organization_id = null,
) => {
  try {
    const db = await getDb();
    let user = await db.collection(COLLECTIONS.USER).findOne({ id });

    if (!user && email) {
      const newUser = {
        id,
        email,
        organization_id: organization_id || null,
        created_at: new Date(),
      };
      
      const result = await db.collection(COLLECTIONS.USER).insertOne(newUser);
      if (result.acknowledged) {
        user = { ...newUser, _id: result.insertedId };
      }
    }

    if (user && organization_id && user.organization_id !== organization_id) {
      const result = await db.collection(COLLECTIONS.USER).updateOne(
        { id },
        { $set: { organization_id } }
      );
      
      if (result.acknowledged) {
        user.organization_id = organization_id;
      }
    }

    return user || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getOrganizationById = async (
  organization_id = null,
  organization_name = null,
) => {
  try {
    const db = await getDb();
    let organization = await db.collection(COLLECTIONS.ORGANIZATION).findOne({ id: organization_id });

    if (!organization && organization_id) {
      const newOrg = {
        id: organization_id,
        name: organization_name || null,
        created_at: new Date(),
        image_url: null,
        allowed_responses_count: null,
        plan: null,
      };
      
      const result = await db.collection(COLLECTIONS.ORGANIZATION).insertOne(newOrg);
      if (result.acknowledged) {
        organization = { ...newOrg, _id: result.insertedId };
      }
    }

    if (organization && organization_name && organization.name !== organization_name) {
      const result = await db.collection(COLLECTIONS.ORGANIZATION).updateOne(
        { id: organization_id },
        { $set: { name: organization_name } }
      );
      
      if (result.acknowledged) {
        organization.name = organization_name;
      }
    }

    return organization || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const ClientService = {
  updateOrganization,
  getClientById,
  getOrganizationById,
};
