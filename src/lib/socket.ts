// lib/socket.ts
import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { prisma } from "./prisma";

export const initializeSocket = (httpServer: HTTPServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    // Verify JWT token here
    // Add user info to socket
    next();
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Join organization room
    socket.on("join:organization", (organizationId: string) => {
      socket.join(`org:${organizationId}`);
    });

    // Join project room
    socket.on("join:project", (projectId: string) => {
      socket.join(`project:${projectId}`);
    });

    // Task updates
    socket.on("task:update", async (data) => {
      const { taskId, updates } = data;
      
      const task = await prisma.task.update({
        where: { id: taskId },
        data: updates,
        include: {
          assignee: true,
          project: true,
        },
      });

      // Broadcast to project room
      io.to(`project:${task.projectId}`).emit("task:updated", task);
    });

    // New comment
    socket.on("comment:create", async (data) => {
      const { taskId, content, userId } = data;
      
      const comment = await prisma.comment.create({
        data: {
          content,
          taskId,
          userId,
        },
        include: {
          user: true,
        },
      });

      const task = await prisma.task.findUnique({
        where: { id: taskId },
      });

      io.to(`project:${task?.projectId}`).emit("comment:created", comment);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};