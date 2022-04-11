import "dotenv/config";
import axios from "axios";
import { User } from "./interfaces";

const authorizerServiceUrl = process.env.AUTHORIZER_SERVICE_URL;
const tenantId = process.env.TENANT_ID;
const authorizerApiKey = process.env.AUTHORIZER_API_KEY;

// get a user's profile from the management API
const getUser: (string) => Promise<User> = async (userId) => {
  try {
    const url = `${authorizerServiceUrl}/api/v1/dir/users/${userId}?fields.mask=id,display_name,picture,email`;

    const response = await axios({
      method: "get",
      url,
      headers: {
        Authorization: `basic ${authorizerApiKey}`,
        "aserto-tenant-id": tenantId,
        "Content-Type": "application/json",
      },
    });

    const result: User = response.data?.result;
    return result;
  } catch (error) {
    console.error(`getUser: caught exception: ${error}`);
    return null;
  }
};

const getUserIdByUserSub: (string) => Promise<string> = async (userSub) => {
  try {
    const url = `${authorizerServiceUrl}/api/v1/dir/identities`;
    const response = await axios({
      method: "post",
      url,
      headers: {
        Authorization: `basic ${authorizerApiKey}`,
        "aserto-tenant-id": tenantId,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        identity: userSub,
      }),
    });

    const result: string = response.data?.id;
    return result;
  } catch (error) {
    console.error(`getUser: caught exception: ${error}`);
    return null;
  }
};

const getUserByUserID: (string) => Promise<User> = async (userSub) => {
  const userId = await getUserIdByUserSub(userSub);
  return await getUser(userId);
};

export { getUserByUserID };
