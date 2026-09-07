import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitProjectRequest } from "@/lib/requests.functions";
import { BUSINESS_TYPES, NEEDS_OPTIONS } from "@/lib/site";

const EMPTY = {
  name: "",
  businessName: "",
  email: "",
  phone: "",
  currentWebsite: "",
  businessType: "",
  needs: "",
  message: "",
};

export function ProjectRequestForm() {
  const submit = useServerFn(submitProjectRequest);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => submit({ data: form }),
    onSuccess: () => setError(null),
    onError: (e: Error) => setError(e.message || "Something went wrong. Please try again."),
  });

  function set<K extends keyof typeof EMPTY>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  if (mutation.isSuccess) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-success/10">
          <CheckCircle2 className="h-6 w-6 text-success" />
        </div>
        <h3 className="mt-4 text-xl font-semibold">Request received</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Thanks — I've got your details and I'll get back to you soon at the email you gave me.
        </p>
        <Button
          variant="outline"
          className="mt-6 rounded-full"
          onClick={() => {
            setForm(EMPTY);
            mutation.reset();
          }}
        >
          Send another request
        </Button>
      </div>
    );
  }

  return (
    <form
      className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || form.message.trim().length < 5) {
          setError("Please fill in your name, email, and a short project description.");
          return;
        }
        setError(null);
        mutation.mutate();
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" required>
          <Input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            maxLength={100}
            required
            autoComplete="name"
          />
        </Field>
        <Field label="Business name">
          <Input
            value={form.businessName}
            onChange={(e) => set("businessName", e.target.value)}
            maxLength={120}
            autoComplete="organization"
          />
        </Field>
        <Field label="Email" required>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            maxLength={255}
            required
            autoComplete="email"
          />
        </Field>
        <Field label="Phone number">
          <Input
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            maxLength={40}
            autoComplete="tel"
          />
        </Field>
        <Field label="Current website (if any)">
          <Input
            value={form.currentWebsite}
            onChange={(e) => set("currentWebsite", e.target.value)}
            maxLength={255}
            placeholder="example.com"
          />
        </Field>
        <Field label="Type of business">
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={form.businessType}
            onChange={(e) => set("businessType", e.target.value)}
          >
            <option value="">Select one</option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="What do you need?">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={form.needs}
              onChange={(e) => set("needs", e.target.value)}
            >
              <option value="">Select one</option>
              {NEEDS_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Tell me about your project" required>
            <Textarea
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              maxLength={3000}
              rows={5}
              required
              placeholder="What does your business do, and what would you like the website to include?"
            />
          </Field>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={mutation.isPending}
        className="mt-6 h-12 w-full rounded-full text-base"
      >
        {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send my project request
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        No payment is taken here. This just starts the conversation.
      </p>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}
