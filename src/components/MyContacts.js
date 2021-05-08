import React, { useContext, useState, useEffect } from "react";
import { fireStoreRef, logoutWrapper } from "../firebase";
import { globalStore } from "./UserContext";
import profilePlaceholder from "../images/profilePlaceholder.png";
import { uuid } from "uuidv4";

const MyContacts = (props) => {
  const { auth } = useContext(globalStore);
  const [contacts, setContacts] = useState([]);
  const [email, setEmail] = useState([]);
  const [userArray, setUserArray] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const getContacts = () => {
    return fireStoreRef()
      .collection("users")
      .where("uid", "in", auth?.contacts)
      .get();
  };

  const renderContacts = (contacts) => {
    return contacts.map((contact, index) => {
      return (
        <div
          key={index}
          class="px-4 py-4 flex bg-grey-light cursor-pointer border-b border-grey-lighter"
          onClick={() => {
            // find out if we have generated chatId for current chat or not (determine wether this is first time chat or not)
            let chat = auth.chats.filter((obj) => {
              return obj.uid === contact.uid;
            });

            if (chat.length > 0) {
              props.setCurrentChat(chat[0]);
            } else {
              let generatedChatId = uuid();
              // init chat of currentuser's side
              fireStoreRef()
                .collection("users")
                .doc(auth.uid)
                .update({
                  chats: [
                    ...auth.chats,
                    {
                      uid: contact.uid,
                      chatId: generatedChatId,
                    },
                  ],
                })
                .then((res) => {
                  // create new doc in chats collection
                  fireStoreRef()
                    .collection("chats")
                    .doc(generatedChatId)
                    .set({
                      subscribers: [auth.uid, contact.uid],
                      messages: [],
                      lastUpdate: Date.now(),
                    })
                    .then((res) => {
                      props.setCurrentChat({
                        uid: contact.uid,
                        chatId: generatedChatId,
                      });
                    });
                });
              // init chat on friend's side
              fireStoreRef()
                .collection("users")
                .doc(contact.uid)
                .update({
                  chats: [
                    ...auth.chats,
                    {
                      uid: auth.uid,
                      chatId: generatedChatId,
                    },
                  ],
                });
            }
          }}
        >
          <div>
            <img
              class="h-12 w-12 rounded-full"
              src={
                contact?.photoUrl.length > 0
                  ? contact?.photoUrl
                  : profilePlaceholder
              }
            />
          </div>
          <div class="ml-4 flex flex-col">
            <div class="flex items-start justify-start ">
              <p class="text-grey-darkest">{contact.name}</p>
            </div>
            <p class="text-gray-600 mt-1 text-sm">{contact.status}</p>
          </div>
        </div>
      );
    });
  };

  useEffect(() => {
    if (auth?.contacts?.length) {
      getContacts().then((querySnapshot) => {
        let arr = [];
        querySnapshot.forEach((doc) => {
          arr.push(doc.data());
        });
        setContacts(arr);
      });
    }
  }, [auth]);

  const renderUserArray = (array) => {
    if (array.length === 0) {
      return (
        <div className="text-center text-gray-400 mb-4">No data avaliable</div>
      );
    }
    return array.map((user) => {
      return (
        <div class="px-4 py-4 flex bg-grey-light cursor-pointer border-b border-grey-lighter">
          <div>
            <img
              class="h-12 w-12 rounded-full"
              src={
                user?.photoUrl.length > 0 ? user?.photoUrl : profilePlaceholder
              }
            />
          </div>
          <div class="ml-4 flex flex-col w-full">
            <div class="flex items-start w-full">
              <p class="text-grey-darkest">{user.name}</p>
              <button
                className="border-2 border-green-500 text-green-500 font-bold text-xs rounded px-2 py-2 ml-auto"
                onClick={(e) => {
                  if (!auth.contacts.includes(user.uid)) {
                    fireStoreRef()
                      .collection("users")
                      .doc(auth.uid)
                      .update({
                        contacts: [...auth.contacts, user.uid],
                      })
                      .then((res) => {
                        fireStoreRef()
                          .collection("users")
                          .doc(user.uid)
                          .update({
                            contacts: [...user.contacts, auth.uid],
                          })
                          .then((r) => {
                            setEmail("");
                            setUserArray([]);
                            setShowInput(false);
                          });
                      });
                  }
                }}
              >
                {auth.contacts.includes(user.uid) ? "Added" : "Add"}
              </button>
            </div>

            <p class="text-gray-600 mt-1 text-sm">{user.status}</p>
          </div>
        </div>
      );
    });
  };
  console.log(userArray);
  return (
    <div className="h-full flex flex-col">
      <div className="w-full px-4 py-4">
        <button
          class="w-full bg-green-600 hover:bg-green-600 focus:bg-green-600 text-white rounded-lg px-3 py-3 font-semibold"
          onClick={() => {
            if (showInput) {
              fireStoreRef()
                .collection("users")
                .where("email", "==", email)
                .get()
                .then((res) => {
                  console.log(email, res);
                  let arr = [];
                  res.forEach((doc) => {
                    arr.push(doc.data());
                  });
                  setUserArray(arr);
                })
                .catch(() => {
                  setUserArray();
                });
            } else {
              setShowInput(true);
            }
          }}
        >
          {showInput ? "Search" : "Add new contact"}
        </button>
        {showInput ? (
          <>
            <input
              type="email"
              value={email}
              class="w-full mt-4 mb-4 pl-3 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-green-500"
              placeholder="Search using email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            {renderUserArray(userArray)}

            <button
              className="w-full bg-white-600 border-2 border-green-500 text-green-500 rounded-lg px-3 py-3 font-semibol"
              onClick={() => {
                setShowInput(false);
              }}
            >
              Close
            </button>
          </>
        ) : (
          <></>
        )}
      </div>
      {renderContacts(contacts)}
      <button
        className="w-full bg-white-600 border-2 mt-auto border-green-500 text-green-500 rounded-lg px-3 py-3 font-semibol"
        onClick={() => {
          logoutWrapper();
        }}
      >
        logout
      </button>
    </div>
  );
};

export default MyContacts;
