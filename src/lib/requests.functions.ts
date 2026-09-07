import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  businessName: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().max(40).optional().default(""),
  currentWebsite: z.string().trim().max(255).optional().default(""),
  businessType: z.string().trim().max(80).optional().default(""),
  needs: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(5, "Please tell me a bit about the project").max(3000),
});

export type ProjectRequestInput = z.input<typeof schema>;

export const submitProjectRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("project_requests").insert({
      name: data.name,
      business_name: data.businessName || null,
      email: data.email,
      phone: data.phone || null,
      current_website: data.currentWebsite || null,
      business_type: data.businessType || null,
      needs: data.needs || null,
      message: data.message,
    });

    if (error) {
      console.error("project_requests insert failed", error);
      throw new Error("Your request could not be saved. Please email me directly.");
    }

    return { ok: true as const };
  });
