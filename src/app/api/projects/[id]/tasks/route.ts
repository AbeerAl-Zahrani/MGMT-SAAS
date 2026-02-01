import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const tasks = await prisma.task.findMany({
    where: { projectId: params.id },
    include: {
      assignee: {
        select: { name: true, avatar: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return Response.json(tasks);
}