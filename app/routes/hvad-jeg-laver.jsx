import { useLoaderData, Link } from "@remix-run/react";
import mongoose from "mongoose";
import { startOfWeek, format, getISOWeek } from "date-fns";
import EntryForm from "~/components/entryform";
import { getSession } from "../components/session.server";
// import "../css/main.css";
import styles from "../css/main.css";
export const links = () => [{ rel: "stylesheet", href: styles }];

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const entries = await mongoose.models.Entry.find().lean().exec();

  return {
    session: session.data,
    entries: entries.map((entry) => ({
      ...entry,
      date: entry.date.toISOString().substring(0, 10),
    })),
  };
}

export default function WhatAmIDoing() {
  const { session, entries } = useLoaderData();
  const entriesByWeek = entries.reduce((acc, entry) => {
    const date = new Date(entry.date);
    const weekStart = format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy");
    const weekNumber = getISOWeek(date);
    const weekKey = `${weekNumber} - ${weekStart}`;
    if (!acc[weekKey]) {
      acc[weekKey] = [];
    }
    acc[weekKey].push(entry);
    return acc;
  }, {});

  return (
    <>
      {session.isAdmin ? <EntryForm entry /> : null}
      <div className="entriesContainer">
        <h1>Entries</h1>
        {Object.entries(entriesByWeek).map(([weekStart, entries]) => (
          <div key={weekStart} className="entryContainer">
            <h2>Week {weekStart}</h2>
            {entries.map((entry) => (
              <ul key={entry._id}>
                <li className={entry.type}>
                  <div key={entry._id} className="entryText">
                    <p>{entry.text}</p>
                    {session.isAdmin ? (
                      <>
                        <Link
                          to={`/entries/${entry._id}/edit`}
                          className="EditBTN"
                        >
                          Edit
                        </Link>
                      </>
                    ) : null}
                  </div>
                </li>
              </ul>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export const action = async ({ request }) => {
  const session = await getSession(request.headers.get("cookie"));
  if (!session.data.isAdmin) {
    throw new Response("Not authenticated", { status: 401 });
  }
  const formData = await request.formData();
  const { date, type, text } = Object.fromEntries(formData);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return await mongoose.models.Entry.create({ date, type, text });
};
