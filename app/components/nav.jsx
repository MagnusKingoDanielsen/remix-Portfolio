import { getSession } from "../components/session.server";
import { useLoaderData, Link, Form } from "@remix-run/react";
import { useEffect } from "react";
import progressbarImg from "../img/ProgressbarIcon.png";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("cookie"));

  return { session: session.data };
}

export default function Nav() {
  const { session } = useLoaderData();
  //   add the window.onscroll function to the useEffect hook
  useEffect(() => {
    window.onscroll = function () {
      myFunction();
    };
  }, []);

  function myFunction() {
    var winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    var height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
  }
  return (
    <nav>
      <div className="navLinks">
        <div className="logo">
          {/* <img src="/logo.png" alt="logo" /> */}
          <p>placeholder</p>
        </div>
        <div className="mainLinks">
          <a href="/projekter">Mine projekter</a>
          <a href="/">Hvem er jeg?</a>
          <a href="/Hvad-jeg-laver">Hvad går jeg og laver?</a>
        </div>
        {session.isAdmin ? (
          <Form method="post">
            <button className="logoutBTN">Logout</button>
          </Form>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
      <div className="progress-container">
        <div className="progress-bar" id="myBar"></div>
        <img src={progressbarImg} alt="" />
      </div>
    </nav>
  );
}
