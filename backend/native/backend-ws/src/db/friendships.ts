import { Chain } from "@coral-xyz/zeus";
import { AUTH_HASURA_URL, AUTH_JWT } from "../config";

const chain = Chain(AUTH_HASURA_URL, {
  headers: {
    Authorization: `Bearer ${AUTH_JWT}`,
  },
});

export const validateRoom = async (uuid: string, roomId: number) => {
  const response = await chain("query")({
    auth_friendships: [
      {
        where: {
          _or: [
            {
              id: { _eq: roomId },
              user1: { _eq: uuid },
            },
            {
              id: { _eq: roomId },
              user2: { _eq: uuid },
            },
          ],
        },
      },
      {
        id: true,
        user1: true,
        user2: true,
      },
    ],
  });

  if (response.auth_friendships[0]) {
    return {
      user1: response.auth_friendships[0].user1,
      user2: response.auth_friendships[0].user2,
    };
  }

  return null;
};

export const updateLatestMessage = async (
  roomId: number,
  message: string,
  sender: string,
  roomValidation: { user1: string; user2: string } | null
) => {
  const interactedProps = getInteractedProps(sender, roomValidation);
  await chain("mutation")({
    update_auth_friendships: [
      {
        _set: {
          last_message_timestamp: new Date(),
          last_message: message,
          last_message_sender: sender,
          ...interactedProps,
        },
        where: { id: { _eq: roomId } },
      },
      { affected_rows: true },
    ],
  }).catch((e) => console.log(`Error while updating latest ${e}`));
};

function getInteractedProps(
  sender: string,
  roomValidation: { user1: string; user2: string } | null
) {
  if (sender === roomValidation?.user1) {
    return {
      user1_interacted: true,
    };
  }
  if (sender === roomValidation?.user2) {
    return {
      user2_interacted: true,
    };
  }
  return {};
}
