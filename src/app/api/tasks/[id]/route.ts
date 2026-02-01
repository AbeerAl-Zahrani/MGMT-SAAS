import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  
  const task = await prisma.task.update({
    where: { id: params.id },
    data,
  });

  return Response.json(task);
}