import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ConversationList from "../components/ConversationList";
import MessageThread from "../components/MessageThread";
import "../css/Messages.css";

function Messages() {
  // Mock current user ID
  const currentUserId = "user1";

  // Mock conversations data
  const [conversations, setConversations] = useState([
    {
      id: 1,
      otherUser: {
        id: "user2",
        name: "(Annons)",
        avatar: "https://images.blocketcdn.se/dynamic/220x220c/profile_placeholders/default",
      },
      product: {
        name: "",
        description: "Nej, det är för lågt. Bara själva f9an inhandlades för 5500 i juli i år.",
        image: "https://images.blocketcdn.se/dynamic/220x220c/profile_placeholders/default",
      },
      lastMessage: "Ja det kan jag. 2300 har jag skrivit i annonsen :)",
      lastMessageDate: "2025-11-10T10:00:00",
      messages: [
        {
          id: 1,
          senderId: "user2",
          content: "Nej, det är för lågt. Bara själva f9an inhandlades för 5500 i juli i år.",
          timestamp: "2025-11-08T09:00:00",
        },
        {
          id: 2,
          senderId: currentUserId,
          content: "Kan du tänka dig 6500?",
          timestamp: "2025-11-08T10:34:00",
        },
        {
          id: 3,
          senderId: "user2",
          content: "Går inte lägre än 7000.",
          timestamp: "2025-11-08T11:53:00",
        },
        {
          id: 4,
          senderId: currentUserId,
          content: "förstår",
          timestamp: "2025-11-10T19:28:00",
          type: "acknowledge",
        },
        {
          id: 5,
          senderId: currentUserId,
          content: "kan du sälja js hjulet separat?",
          timestamp: "2025-11-10T19:49:00",
        },
        {
          id: 6,
          senderId: "user2",
          content: "Ja det kan jag. 2300 har jag skrivit i annonsen :)",
          timestamp: "2025-11-10T21:16:00",
        },
      ],
    },
    {
      id: 2,
      otherUser: {
        id: "user3",
        name: "(Annons)",
        avatar: "https://images.blocketcdn.se/dynamic/220x220c/profile_placeholders/default",
      },
      product: {
        name: "",
      },
      lastMessage: "Du: Är lite osäker vilken byggnad det är",
      lastMessageDate: "2025-11-08T14:30:00",
      messages: [
        {
          id: 1,
          senderId: "user3",
          content: "Hej! Är denna fortfarande tillgänglig?",
          timestamp: "2025-11-08T13:00:00",
        },
        {
          id: 2,
          senderId: currentUserId,
          content: "Är lite osäker vilken byggnad det är",
          timestamp: "2025-11-08T14:30:00",
        },
      ],
    },
    {
      id: 3,
      otherUser: {
        id: "user4",
        name: "Racing Simulator Set – Moza R5 + Tillbehör",
        avatar: "https://images.blocketcdn.se/dynamic/220x220c/profile_placeholders/default",
      },
      product: {
        name: "Racing Simulator Set – Moza R5 + Tillbehör",
        image: "https://via.placeholder.com/50",
        sold: true,
      },
      lastMessage: "Tyvärr inte",
      lastMessageDate: "2025-11-07T16:20:00",
      messages: [
        {
          id: 1,
          senderId: currentUserId,
          content: "Hej! Finns denna kvar?",
          timestamp: "2025-11-07T15:00:00",
        },
        {
          id: 2,
          senderId: "user4",
          content: "Tyvärr inte",
          timestamp: "2025-11-07T16:20:00",
        },
      ],
    },
    {
      id: 4,
      otherUser: {
        id: "user5",
        name: "(Annons)",
        avatar: "https://images.blocketcdn.se/dynamic/220x220c/profile_placeholders/default",
      },
      lastMessage: "Ok ingen fara 👍",
      lastMessageDate: "2025-11-07T12:15:00",
      messages: [
        {
          id: 1,
          senderId: "user5",
          content: "Kan du leverera?",
          timestamp: "2025-11-07T10:00:00",
        },
        {
          id: 2,
          senderId: currentUserId,
          content: "Nej tyvärr, endast upphämtning",
          timestamp: "2025-11-07T11:00:00",
        },
        {
          id: 3,
          senderId: "user5",
          content: "Ok ingen fara 👍",
          timestamp: "2025-11-07T12:15:00",
        },
      ],
    },
    {
      id: 5,
      otherUser: {
        id: "user6",
        name: "(Annons)",
        avatar: "https://images.blocketcdn.se/dynamic/220x220c/profile_placeholders/default",
      },
      lastMessage: "Nej",
      lastMessageDate: "2025-11-06T18:45:00",
      messages: [
        {
          id: 1,
          senderId: currentUserId,
          content: "Fungerar detta med iPhone 14?",
          timestamp: "2025-11-06T17:00:00",
        },
        {
          id: 2,
          senderId: "user6",
          content: "Nej",
          timestamp: "2025-11-06T18:45:00",
        },
      ],
    },
    {
      id: 6,
      otherUser: {
        id: "user7",
        name: "(Annons)",
        avatar: "https://images.blocketcdn.se/dynamic/220x220c/profile_placeholders/default",
      },
      lastMessage: "Nej tyvärr. Jag köpte stolen...",
      lastMessageDate: "2025-11-06T09:30:00",
      messages: [
        {
          id: 1,
          senderId: currentUserId,
          content: "Finns den kvar?",
          timestamp: "2025-11-06T08:00:00",
        },
        {
          id: 2,
          senderId: "user7",
          content: "Nej tyvärr. Jag köpte stolen efter då ingår inte hjulen och...",
          timestamp: "2025-11-06T09:30:00",
        },
      ],
    },
    {
      id: 7,
      otherUser: {
        id: "user8",
        name: "(Annons)",
        avatar: "https://images.blocketcdn.se/dynamic/220x220c/profile_placeholders/default",
      },
      lastMessage: "Hej! Mötas halvvägs på 1200?",
      lastMessageDate: "2025-11-04T14:20:00",
      messages: [
        {
          id: 1,
          senderId: "user8",
          content: "Hej! Mötas halvvägs på 1200?",
          timestamp: "2025-11-04T14:20:00",
        },
      ],
    },
    {
      id: 8,
      otherUser: {
        id: "user9",
        name: "(Annons)",
        avatar: "https://images.blocketcdn.se/dynamic/220x220c/profile_placeholders/default",
      },
      lastMessage: "Låter grymt!🔥",
      lastMessageDate: "2025-11-03T20:10:00",
      messages: [
        {
          id: 1,
          senderId: currentUserId,
          content: "Hej! Jag kan hämta imorgon kväll",
          timestamp: "2025-11-03T19:00:00",
        },
        {
          id: 2,
          senderId: "user9",
          content: "Låter grymt!🔥",
          timestamp: "2025-11-03T20:10:00",
        },
      ],
    },
  ]);

  const [activeConversationId, setActiveConversationId] = useState(1);

  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  const handleSendMessage = (content) => {
    if (!activeConversation) return;

    const newMessage = {
      id: activeConversation.messages.length + 1,
      senderId: currentUserId,
      content,
      timestamp: new Date().toISOString(),
    };

    setConversations((prevConversations) =>
      prevConversations.map((conv) => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: content,
            lastMessageDate: newMessage.timestamp,
          };
        }
        return conv;
      })
    );
  };

  return (
    <>
      <Navbar />
      <div className="messages-page">
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
        />
        <MessageThread
          conversation={activeConversation}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
        />
      </div>
    </>
  );
}

export default Messages;
