import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarPlus, Dumbbell, Clock, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { ROUTINES, routineDrills, drillWorkoutRow, ALL_DRILLS, type Routine } from "@/lib/routines";
import { formatPrescription } from "@/lib/program";

type Props = { defaultDate?: string; trigger?: React.ReactNode };

export function RoutineLibrary({ defaultDate, trigger }: Props) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Routine | null>(null);
  const [drillId, setDrillId] = useState<string | null>(null);
  const [date, setDate] = useState(defaultDate ?? format(new Date(), "yyyy-MM-dd"));
  const [repeat, setRepeat] = useState("1");
  const [focus, setFocus] = useState("All");

  const focuses = useMemo(() => ["All", ...Array.from(new Set(ROUTINES.map((r) => r.focus)))], []);
  const list = focus === "All" ? ROUTINES : ROUTINES.filter((r) => r.focus === focus);

  const reset = () => {
    setSelected(null);
    setDrillId(null);
    setRepeat("1");
  };

  const schedule = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const base = drillId ? [drillWorkoutRow(drillId)] : routineDrills(selected!).map((d) => drillWorkoutRow(d.id));
      const weeks = Math.max(1, Math.min(12, Number(repeat) || 1));
      const start = new Date(`${date}T12:00:00`);
      const rows = [] as Array<Record<string, unknown>>;
      for (let w = 0; w < weeks; w++) {
        const d = new Date(start);
        d.setDate(d.getDate() + w * 7);
        const scheduled_date = format(d, "yyyy-MM-dd");
        for (const row of base) rows.push({ ...row, user_id: u.user.id, scheduled_date });
      }
      const { error } = await supabase.from("workouts").insert(rows as never);
      if (error) throw error;
      return rows.length;
    },
    onSuccess: (count) => {
      qc.invalidateQueries({ queryKey: ["workouts"] });
      toast.success(`Scheduled ${count} workout${count === 1 ? "" : "s"}`);
      setOpen(false);
      reset();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const activeName = drillId
    ? ALL_DRILLS.find((d) => d.id === drillId)?.name
    : (selected?.name ?? null);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" variant="outline">
            <Dumbbell className="mr-1 h-4 w-4" /> Workout library
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        {activeName ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <button type="button" onClick={reset} className="text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {activeName}
              </DialogTitle>
              <DialogDescription>Pick a date — schedule it once or repeat it weekly.</DialogDescription>
            </DialogHeader>

            {selected && !drillId && (
              <ul className="space-y-1.5 rounded-xl bg-muted/40 p-3 text-sm">
                {routineDrills(selected).map(({ id, drill }) => (
                  <li key={id} className="flex justify-between gap-3">
                    <span className="font-medium">{drill.name}</span>
                    <span className="text-right text-xs text-muted-foreground">
                      {formatPrescription(drill.base)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Repeat weekly</Label>
                <Select value={repeat} onValueChange={setRepeat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 6, 8, 12].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n === 1 ? "Just this day" : `${n} weeks`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                className="w-full bg-gradient-primary"
                disabled={schedule.isPending}
                onClick={() => schedule.mutate()}
              >
                <CalendarPlus className="mr-1 h-4 w-4" /> Add to my plan
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Workout library</DialogTitle>
              <DialogDescription>
                Ready-made routines you can schedule on any day, or add a single drill.
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="routines">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="routines">Routines</TabsTrigger>
                <TabsTrigger value="drills">Single drills</TabsTrigger>
              </TabsList>

              <TabsContent value="routines" className="mt-3 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {focuses.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFocus(f)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        focus === f
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                {list.map((r) => (
                  <Card
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className="cursor-pointer rounded-xl border-border p-4 transition hover:border-primary/50 hover:shadow-card"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold">{r.name}</div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{r.description}</p>
                      </div>
                      <Badge variant="secondary" className="shrink-0 text-[10px] uppercase tracking-wider">
                        {r.focus}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {r.minutes} min
                      </span>
                      <span>{r.drillIds.length} drills</span>
                      <span>{r.level}</span>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="drills" className="mt-3 space-y-1.5">
                {ALL_DRILLS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDrillId(d.id)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-border px-3 py-2.5 text-left transition hover:border-primary/50"
                  >
                    <span className="text-sm font-medium">{d.name}</span>
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {d.category}
                    </span>
                  </button>
                ))}
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
