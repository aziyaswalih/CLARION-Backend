 
 import { timeStamp } from "console";
import { io } from "./app";
import { ActiveConnection } from "./infrastructure/database/models/ActivateModel";
import { IMessage, MessageModel } from "./infrastructure/database/models/MessageModel";

 
  const activeUsers = new Map<string, string>(); // userId -> socketId
 
 
 
  export const socket_Connection=()=>{
 
      
      io.on("connection", (socket) => {
   console.log(`A user connected: ${socket.id}`);
   console.log(`Total connections: ${io.engine.clientsCount}`);
 
 
   socket.on("register", async (userType: string, userId: string) => {
     console.log(`User registered: ${userType}, ID: ${userId}, Socket: ${socket.id}`);
 
     activeUsers.set(userId, socket.id); 
  
     try { 
       await ActiveConnection.findOneAndUpdate(
           { userType, userId },
         { socketId: socket.id },
         { upsert: true }
       );
     } catch (error) {
       console.error("Error registering user:", error);
     }
   });

   socket.on('deleteMessage', async ({ messageId, participants }: { messageId: string, participants: string[] }) => {
    console.log(`Received 'deleteMessage' for ID: ${messageId} from socket: ${socket.id}`);

    try {
        // Find the message to get sender information
        const messageToDelete = await MessageModel.findOne({messageId:messageId});

        if (!messageToDelete) {
            console.warn(`Delete failed: Message ID ${messageId} not found.`);
            // Optional: Emit an error back to the sender
            socket.emit('deleteError', { messageId, error: 'Message not found' });
            return;
        }

        // Get the user ID associated with the current socket for authorization
        const userIdFromSocket = [...activeUsers.entries()].find(([id, sid]) => sid === socket.id)?.[0];

        // Authorization Check: Ensure the user deleting is the actual sender of the message
        if (!userIdFromSocket || messageToDelete.sender.toString() !== userIdFromSocket.toString()) { // Convert to string for robust comparison
             console.warn(`Unauthorized delete attempt for message ${messageId} by user ${userIdFromSocket}. Sender was ${messageToDelete.sender}.`);
             // Optional: Emit an error back to the sender
             socket.emit('deleteError', { messageId: messageId, error: 'Unauthorized deletion attempt' });
             return;
        }

        // Delete the message from the database
        await MessageModel.findByIdAndDelete(messageToDelete._id);
        console.log(`✅ Message ID ${messageToDelete._id} deleted from DB.`);

        // Broadcast the deletion event to all participants in the conversation
        // Find the socket IDs of all participants in this conversation
        // 'participants' array should contain the senderId and receiverId of the original message
        const participantSocketIds = participants
            .map(id => activeUsers.get(id)) // Get socket ID for each participant ID
            .filter((socketId): socketId is string => !!socketId && socketId !== socket.id); // Filter out undefined and the socket that initiated the delete (they already did optimistic update)

        console.log(`Broadcasting 'messageDeleted' for ID ${messageId} to sockets:`, participantSocketIds);

        // Use io.to() to emit the event to the specific sockets of the participants
         participantSocketIds.forEach(sid => {
             io.to(sid).emit('messageDeleted ', { messageId });
         });

         // Optional: Emit a success confirmation back to the sender if needed (beyond optimistic)
         // socket.emit('deleteConfirmation', { messageId });


    } catch (error) {
        console.error(`Error deleting message on ${messageId}:`, error);
        // Optional: Emit an error back to the sender
        socket.emit('deleteError', { messageId, error: 'Failed to delete' });
    }
});
 
   socket.on("markAsRead", async ({ sender, receiver }) => {
     console.log("✅ Marking messages as read...");
   
     try {
       await MessageModel.updateMany({ sender, receiver }, { $set: { isRead: true } });
   
       const senderSocketId = activeUsers.get(sender);
       if (senderSocketId) {
         io.to(senderSocketId).emit("messagesRead", { sender });
         console.log(`📢 Sent 'messagesRead' event to sender: ${senderSocketId}`);
       }
     } catch (error) {
       console.error("Error marking messages as read:", error);
     }
   });
   
   
  
   socket.on('callData',({ senderId, receiverId,  callType })=>{
     console.log(senderId,receiverId,callType);
     const usersideId=activeUsers.get(senderId)
     console.log("userSocket ID",usersideId);
     console.log("Active users:", [...activeUsers.entries()]);
     console.log("All rooms:", io.sockets.adapter.rooms);
     
     
     if (usersideId) {
       io.to(usersideId).emit('callDetails',{senderId,receiverId,callType})
       console.log("sended call data",usersideId);
       
       
     }
     
     
     
 })
   socket.on("call", ({ senderId,senderName, receiverId, roomId, callType ,senderProfilePic}) => {
     console.log("📞 Incoming Call Request:", { senderId,senderName, receiverId, callType });
 socket.join(roomId)
     const receiverSocketId = activeUsers.get(receiverId);
     if (receiverSocketId) {
       io.to(receiverSocketId).emit("callIncoming", { callType, senderId, roomId,senderName ,senderProfilePic});
       console.log("📢 Call Incoming event emitted");
     }
   });
 
   
   socket.on("acceptCall", ({ roomId, employeeId }) => {
     console.log(`✅ Call Accepted in room: ${roomId}, Employee ID: ${employeeId}`);
 
     socket.join(roomId); 
     console.log(`🔗 User joined room: ${roomId}`);
 
     setTimeout(() => {  
       console.log(`📢 Emitting "callAccepted" to room: ${roomId}`);
       io.to(roomId).emit("callAccepted", { roomId, employeeId });
     }, 100); 
   });
 socket.on('rejectCall',({roomId,senderId})=>{
   console.log(senderId,roomId);
   io.to(roomId).emit('rejected',{roomId,senderId})
   
 })
 
 
   socket.on(
     "sendMessage",
     async ({ sender, receiver, message, userType, messageId, status ,attachment }) => {
       console.log(`Message from ${sender} to ${receiver}: ${message}`);
       console.log(sender,
         receiver,
         message,
         userType,
         messageId,
         status,
         attachment
 
       );
       
       
       try {
           const recipient = await ActiveConnection.findOne({ userType, userId: receiver});
         console.log(recipient);
         
         const savedmessage:IMessage = await new MessageModel({ sender, receiver, message, userType,messageId:messageId,  attachment: attachment ? {
           type: attachment.type,
           url: attachment.url,
           name: attachment.name,
           size: attachment.size
         } : undefined
        }).save();
        console.log("Message saved:", savedmessage,messageId);
        
         if (recipient) {
           io.to(recipient.socketId).emit("chatMessage", { _id:savedmessage._id,sender, message, messageId,timestamp: Date.now(), status ,attachment, // Sending attachment data
           });
           console.log(`Message sent to ${receiver} (Socket: ${recipient.socketId})`);
           
         } else {
             console.log(`User ${receiver} is offline.`);
         }
     } catch (error) {
         console.error("Error sending message:", error);
     }
 }
 );
 
 socket.on("newBooking", (booking) => {
     console.log("New Booking Request:", booking);
     io.emit("bookingNotification", booking);
 });
 
   socket.on("disconnect", async (reason) => {
     const userId = [...activeUsers.entries()].find(([_, sid]) => sid === socket.id)?.[0];
     if (userId) {
       activeUsers.delete(userId);
       console.log(`User ${userId} removed.`);
     }
       });
 });
 
 }

