export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  if (!res.ok) throw new Error("Erreur lors de l'upload");
  const json = await res.json();
  if (!json.url) throw new Error("Erreur lors de l'upload");
  return json.url;
}
