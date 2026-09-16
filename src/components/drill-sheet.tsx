import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Lightbulb, ListChecks, PlayCircle, ShieldAlert } from "lucide-react";
import { DRILLS, formatPrescription, type Drill, type Prescription } from "@/lib/program";

type Props = {
  drillId: string | null;
  prescription?: Prescription;
  onOpenChange: (open: boolean) => void;
};

export function DrillSheet({ drillId, prescription, onOpenChange }: Props) {
  const drill: Drill | undefined = drillId ? DRILLS[drillId] : undefined;
  const open = !!drill;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-3xl">
        {drill && (
          <>
            <SheetHeader className="text-left">
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="secondary" className="uppercase tracking-wider">
                  {drill.category}
                </Badge>
                {prescription && (
                  <Badge className="bg-primary text-primary-foreground">
                    {formatPrescription(prescription) || "As prescribed"}
                  </Badge>
                )}
              </div>
              <SheetTitle className="text-2xl">{drill.name}</SheetTitle>
              {prescription?.note && (
                <SheetDescription>{prescription.note}</SheetDescription>
              )}
            </SheetHeader>

            <div className="mt-5 space-y-5 pb-8">
              <Section icon={<PlayCircle className="h-4 w-4" />} title="Video demonstration">
                <div className="grid aspect-video place-items-center rounded-xl border border-dashed border-border bg-muted/40 text-xs text-muted-foreground">
                  Video demo coming soon
                </div>
              </Section>

              <Section icon={<ListChecks className="h-4 w-4" />} title="Technique">
                <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-relaxed">
                  {drill.technique.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ol>
              </Section>

              {drill.commonMistakes.length > 0 && (
                <Section
                  icon={<AlertTriangle className="h-4 w-4 text-warning" />}
                  title="Common mistakes"
                >
                  <ul className="space-y-1.5 text-sm">
                    {drill.commonMistakes.map((m, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-warning">•</span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {drill.coachingTips.length > 0 && (
                <Section
                  icon={<Lightbulb className="h-4 w-4 text-primary" />}
                  title="Coaching tips"
                >
                  <ul className="space-y-1.5 text-sm">
                    {drill.coachingTips.map((t, i) => (
                      <li key={i} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {drill.safety.length > 0 && (
                <Section
                  icon={<ShieldAlert className="h-4 w-4 text-destructive" />}
                  title="Safety reminders"
                >
                  <ul className="space-y-1.5 text-sm">
                    {drill.safety.map((s, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-destructive">!</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {title}
      </h3>
      {children}
    </section>
  );
}
