"use client";

export function SetupWorkspaceButton() {
  async function handleSetup() {
    const res = await fetch("/api/corsair/setup", {
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data);
      alert("Setup failed");
      return;
    }

    alert("Workspace setup complete");
  }

  return (
    <button onClick={handleSetup}>
      Setup Workspace
    </button>
  );
}