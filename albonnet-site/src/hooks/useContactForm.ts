"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { sendContactForm } from "@/lib/api/contact";

type Status = "idle" | "sending" | "success" | "error";

export function useContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const { ok } = await sendContactForm(form.name, form.email, form.message);
      if (ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setStatus("idle"), 4000);
      }
    } catch {
      setStatus("error");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return { form, status, handleChange, handleSubmit };
}
