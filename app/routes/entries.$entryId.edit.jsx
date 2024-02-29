import mongoose from "mongoose";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import EntryForm from "~/components/entryform";
import { getSession } from "../components/session.server";

export async function loader({ params, request }) {
  //error handling for non-admin user
  const session = await getSession(request.headers.get("cookie"));
  if (!session.data.isAdmin) {
    throw new Response("Not authenticated", { status: 401 });
  }
  //error handling for invalid entryId
  if (typeof params.entryId !== "string") {
    throw new Response("Not found", { status: 404 });
  }
  const entry = await mongoose.models.Entry.findById(params.entryId)
    .lean()
    .exec();
  console.log("entry" + entry);
  //error handling for non-existent entry
  if (!entry) {
    throw new Response("Not found", { status: 404 });
  }
  return {
    ...entry,
    date: entry.date.toISOString().substring(0, 10),
  };
}

export default function EditPage() {
  const entry = useLoaderData();
  function handleSubmit(e) {
    if (confirm("Are you sure?")) {
    } else {
      // User clicked "Cancel"
      e.preventDefault();
    }
  }
  console.log("test" + entry);
  return (
    <div>
      <EntryForm entry={entry} />
      <Form method="post" onSubmit={handleSubmit}>
        <button name="_action" value="delete" type="submit">
          Delete this entry...
        </button>
      </Form>
    </div>
  );
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const session = await getSession(request.headers.get("cookie"));
  if (!session.data.isAdmin) {
    throw new Response("Not authenticated", { status: 401 });
  }

  // Artificial delay to simulate slow network
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (formData.get("_action") === "delete") {
    await mongoose.models.Entry.findByIdAndDelete(params.entryId);

    return redirect("/");
  } else {
    const entry = Object.fromEntries(formData);
    const entryToUpdate = await mongoose.models.Entry.findById(params.entryId);

    entryToUpdate.date = entry.date;
    entryToUpdate.type = entry.type;
    entryToUpdate.text = entry.text;

    await entryToUpdate.save();
    return redirect("/");
  }
}
