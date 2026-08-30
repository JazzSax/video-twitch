import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/prisma/db";

export async function POST(request: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 400 });
  }
 
  const headersPayload = await headers();
  const svix_id = headersPayload.get("svix-id");
  const svix_timestamp = headersPayload.get("svix-timestamp");
  const svix_signature = headersPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

	const payload = await request.json();
	const body = JSON.stringify(payload);
	const wh = new Webhook(WEBHOOK_SECRET);
	let event: WebhookEvent;
	try {
		event = wh.verify(body, {
			"svix-id": svix_id,
			"svix-timestamp": svix_timestamp,
			"svix-signature": svix_signature,
		}) as WebhookEvent;
	} catch {
		return new Response("Invalid signature", { status: 400 });
	}


	console.log(`Webhook received: ${event.type}`);

  if (event.type === "user.created") {
			const {
				id,
				username,
        image_url,
			} = event.data;

	

			await db.orm.public.User.create({
				clerkId: id,
				username,
        imageUrl: image_url,
			});
			return new Response("User created", { status: 200 });
		}
  if (event.type === "user.updated") {
    const {
      id,
      username,
      image_url,
    } = event.data;  

    const updated = await db.orm.public.User
      .where({ clerkId: id })
      .update({ username, imageUrl: image_url });

    if (!updated) {
      return new Response("User not found", { status: 404 });
    }

    return new Response("User updated", { status: 200 });
  }
  if (event.type === "user.deleted") {
    const {
      id,
    } = event.data;

    const deleted = await db.orm.public.User
      .where({ clerkId: id })
      .delete();

    if (!deleted) {
      return new Response("User not found", { status: 404 });
    }

    return new Response("User deleted", { status: 200 });
  }
  return new Response("Webhook received", { status: 200 });
}