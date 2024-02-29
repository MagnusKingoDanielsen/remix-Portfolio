import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";

export default function EntryForm({ entry }) {
  const fetcher = useFetcher();
  const textareaRef = useRef(null);
  console.log("entryForm" + entry);
  const dateValue = entry.date
    ? new Date(entry.date).toISOString().split("T")[0]
    : "";
  const labels = [
    { label: "Work", value: "work" },
    { label: "Learning", value: "learning" },
    { label: "Interesting thing", value: "interesting-thing" },
  ];

  const isIdle = fetcher.state === "idle";
  const isInit = isIdle && fetcher.data == null;

  // Clear the form and focus the textarea after a submission
  useEffect(() => {
    if (!isInit && isIdle && textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.focus();
    }
  }, [isInit, isIdle]);

  return (
    <fetcher.Form method="post" className="AddForm">
      <fieldset disabled={fetcher.state !== "idle"} className="fieldset">
        <h2>Add Entry</h2>
        <div className="dateAndType">
          <div className="datePicker">
            {/* Date picker */}
            <input
              type="date"
              id="date"
              name="date"
              defaultValue={dateValue}
              required
            />
          </div>
          <div className="typePicker">
            {/* Type picker that goes over an array of labels */}
            {labels.map((option) => (
              <label key={option.value} className="inline-block">
                <input
                  required
                  type="radio"
                  className="mr-1"
                  name="type"
                  value={option.value}
                  defaultChecked={option.value === (entry?.type ?? "work")}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
        <div className="description">
          <textarea
            id="text"
            name="text"
            ref={textareaRef}
            placeholder="write your journal here..."
            defaultValue={entry?.text}
            required
          />
        </div>
        <button type="submit" disabled={fetcher.state === "submitting"}>
          {fetcher.state !== "idle" ? "Saving..." : "Save"}
        </button>
      </fieldset>
    </fetcher.Form>
  );
}
