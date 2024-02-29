import { Form, Link, redirect, useLoaderData } from "@remix-run/react";
import { commitSession, getSession } from "../components/session.server";
export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));

  return session.data;
}

export default function LoginPage() {
  const data = useLoaderData();
  return (
    <div>
      {data.isAdmin ? (
        <>
          <p>You're logged in!</p>
          <Link to="/">Go to portfolio</Link>
        </>
      ) : (
        <Form method="post">
          <input placeholder="email" name="email" type="email" />
          <input placeholder="password" name="password" type="password" />
          <button>Log in</button>
        </Form>
      )}
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const { email, password } = Object.fromEntries(formData);

  if (email === "sam@buildui.com" && password === "password") {
    const session = await getSession();
    session.set("isAdmin", true);

    return redirect("/", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } else {
    return null;
  }
}
